import * as Tone from "tone";

import {
  CLIMAX_CHANT_PHRASES,
  NOTE_INTERVAL_SECONDS,
  NOTE_RELEASE_SECONDS,
  SWAN_LAKE_SEQUENCE,
} from "@/soft-whisper/experience/cues";
import { peakLevelForSamples } from "@/soft-whisper/audio/captureMath";
import { detectBleedRisk, derivePassThreshold } from "@/soft-whisper/audio/micMath";
import { renderProcessedPlayback } from "@/soft-whisper/audio/processPlayback";
import { noteVolumeForIndex } from "@/soft-whisper/experience/handleMath";
import type {
  CueDefinition,
  MicCalibrationResult,
  MicGateConfig,
  ProcessedPlayback,
} from "@/soft-whisper/experience/types";

export interface MeterSnapshot {
  level: number;
  threshold: number;
  prompt: string;
}

export interface InstallationRuntimeSnapshot {
  selectedVoice: string | null;
  hasStream: boolean;
  recorderState: string;
  chunkCount: number;
  passThreshold: number | null;
  playbackReady: boolean;
}

export interface InstallationRuntime {
  primeFromGesture(): Promise<void>;
  bootCrowdSession(): Promise<{ calibration: MicCalibrationResult; voiceName: string | null }>;
  runPrompt(
    cue: CueDefinition,
    gateConfig: MicGateConfig,
    signal: AbortSignal,
    onMeter: (snapshot: MeterSnapshot) => void,
  ): Promise<void>;
  queueMusicBoxNote(noteIndex: number, signal: AbortSignal): Promise<void>;
  prepareClimaxPlayback(signal: AbortSignal): Promise<ProcessedPlayback>;
  playClimax(signal: AbortSignal): Promise<void>;
  stopAll(): Promise<void>;
  getSnapshot(): InstallationRuntimeSnapshot;
  setScenario?(scenario: string): void;
  setClimaxMuted(muted: boolean): void;
}

export const DEFAULT_GATE_CONFIG: MicGateConfig = {
  sampleWindowMs: 70,
  holdMs: 70,
  maxWaitMs: 8500,
  minThreshold: 0.03,
  multiplier: 1.35,
  ambientOffset: 0.01,
};

const PIANO_SAMPLE_URLS = {
  B4: "/samples/piano/B4.mp3",
  D4: "/samples/piano/D4.mp3",
  E4: "/samples/piano/E4.mp3",
  "F#4": "/samples/piano/Fs4.mp3",
  G4: "/samples/piano/G4.mp3",
} as const;

function createDriveCurve(amount = 120): Float32Array {
  const sampleCount = 256;
  const curve = new Float32Array(sampleCount);
  const radians = Math.PI / 180;

  for (let index = 0; index < sampleCount; index += 1) {
    const x = (index * 2) / sampleCount - 1;
    curve[index] = ((3 + amount) * x * 20 * radians) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);

    if (signal) {
      const abortHandler = () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      };

      signal.addEventListener("abort", abortHandler, { once: true });
    }
  });
}

function supportedConstraints(): MicCalibrationResult["supportedConstraints"] {
  const supported = navigator.mediaDevices.getSupportedConstraints();

  return {
    echoCancellation: Boolean(supported.echoCancellation),
    noiseSuppression: Boolean(supported.noiseSuppression),
    autoGainControl: Boolean(supported.autoGainControl),
  };
}

function getMediaRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  return candidates.find((candidate) => {
    try {
      return MediaRecorder.isTypeSupported(candidate);
    } catch {
      return false;
    }
  });
}

class BrowserInstallationRuntime implements InstallationRuntime {
  private sampler: Tone.Sampler | null = null;

  private noteAccent: Tone.PolySynth | null = null;

  private reverb: Tone.Reverb | null = null;

  private musicBoxBus: Tone.Gain | null = null;

  private noteHighpass: Tone.Filter | null = null;

  private noteLowpass: Tone.Filter | null = null;

  private stream: MediaStream | null = null;

  private analyser: AnalyserNode | null = null;

  private sourceNode: MediaStreamAudioSourceNode | null = null;

  private mediaRecorder: MediaRecorder | null = null;

  private recordedChunks: Blob[] = [];

  private audioContext: AudioContext | null = null;

  private selectedVoice: SpeechSynthesisVoice | null = null;

  private calibration: MicCalibrationResult | null = null;

  private processedBuffer: AudioBuffer | null = null;

  private climaxSource: AudioBufferSourceNode | null = null;

  private masterGain: GainNode | null = null;

  private lastScheduledNoteAt = 0;

  private climaxMuted = false;

  async primeFromGesture(): Promise<void> {
    await Tone.start();
    this.audioContext = Tone.getContext().rawContext as AudioContext;

    if (!this.masterGain) {
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 1.8;
      this.masterGain.connect(this.audioContext.destination);
    }

    await this.ensureSynthReady();
    await this.ensureVoiceSelected();
  }

  async bootCrowdSession(): Promise<{ calibration: MicCalibrationResult; voiceName: string | null }> {
    await this.primeFromGesture();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        channelCount: 1,
      },
    });

    this.stream = stream;
    this.sourceNode?.disconnect();
    this.analyser?.disconnect();

    this.sourceNode = this.audioContext!.createMediaStreamSource(stream);
    this.analyser = this.audioContext!.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.68;
    this.sourceNode.connect(this.analyser);

    this.startRecording();
    const calibration = await this.calibrate(DEFAULT_GATE_CONFIG.sampleWindowMs, 1900);
    const bleedRisk = await this.checkSpeakerBleed(calibration.passThreshold);

    this.calibration = {
      ...calibration,
      bleedRisk,
    };

    return {
      calibration: this.calibration,
      voiceName: this.selectedVoice?.name ?? null,
    };
  }

  async runPrompt(
    cue: CueDefinition,
    gateConfig: MicGateConfig,
    signal: AbortSignal,
    onMeter: (snapshot: MeterSnapshot) => void,
  ): Promise<void> {
    if (cue.speech) {
      await this.speak(cue.speech, signal);
    }

    if (cue.gateKind === "none") {
      onMeter({ level: 0, threshold: 0, prompt: cue.id });
      await wait(cue.minPromptMs, signal);
      return;
    }

    const calibration = this.calibration;

    if (!calibration) {
      throw new Error("No microphone calibration is available for the prompt gate.");
    }

    while (!signal.aborted) {
      const passed = await this.waitForAffirmation(
        {
          ...gateConfig,
          minThreshold: calibration.passThreshold,
        },
        cue.id,
        signal,
        onMeter,
      );

      if (passed) {
        onMeter({ level: calibration.passThreshold, threshold: calibration.passThreshold, prompt: cue.id });
        await wait(Math.max(180, cue.minPromptMs * 0.25), signal);
        return;
      }

      if (cue.retrySpeech) {
        await this.speak(cue.retrySpeech, signal);
      }
    }
  }

  async queueMusicBoxNote(noteIndex: number, signal: AbortSignal): Promise<void> {
    await this.ensureSynthReady();

    const noteName = SWAN_LAKE_SEQUENCE[noteIndex];
    const releaseSeconds = NOTE_RELEASE_SECONDS[noteIndex] ?? 1.8;
    const velocity = noteVolumeForIndex(noteIndex);
    const now = Tone.now();
    const scheduledAt = Math.max(now + 0.1, this.lastScheduledNoteAt + NOTE_INTERVAL_SECONDS);

    this.sampler!.triggerAttackRelease(noteName, releaseSeconds, scheduledAt, Math.min(0.96, velocity));
    this.noteAccent!.triggerAttackRelease(noteName, 0.22, scheduledAt + 0.01, velocity * 0.2);
    this.lastScheduledNoteAt = scheduledAt;

    await wait(Math.max(70, (scheduledAt - now) * 1000 + 120), signal);
  }

  async prepareClimaxPlayback(signal: AbortSignal): Promise<ProcessedPlayback> {
    if (!this.audioContext) {
      throw new Error("Audio context is not ready.");
    }

    const capture = await this.stopRecording();

    let rendered: Awaited<ReturnType<typeof renderProcessedPlayback>>;

    try {
      const captured = await this.buildCaptureBuffer(capture);
      rendered = await renderProcessedPlayback(this.audioContext, captured);
    } catch {
      const fallback = this.createEmergencyBlastBuffer();
      rendered = await renderProcessedPlayback(this.audioContext, fallback);
    }

    this.processedBuffer = rendered.buffer;
    await wait(120, signal);

    return rendered.metadata;
  }

  async playClimax(signal: AbortSignal): Promise<void> {
    if (this.climaxMuted) {
      await wait(900, signal);
      return;
    }

    if (!this.audioContext || !this.processedBuffer) {
      throw new Error("No processed playback is ready.");
    }

    await this.audioContext.resume();

    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const highpass = this.audioContext.createBiquadFilter();
    const lowpass = this.audioContext.createBiquadFilter();
    const drive = this.audioContext.createWaveShaper();
    const limiter = this.audioContext.createDynamicsCompressor();
    const makeupGain = this.audioContext.createGain();

    highpass.type = "highpass";
    highpass.frequency.value = 120;
    highpass.Q.value = 0.72;

    lowpass.type = "lowpass";
    lowpass.frequency.value = 5800;
    lowpass.Q.value = 0.35;

    drive.curve = createDriveCurve(170);
    drive.oversample = "4x";

    limiter.threshold.value = -10;
    limiter.knee.value = 0.5;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.0005;
    limiter.release.value = 0.08;

    gain.gain.value = 14.0;
    makeupGain.gain.value = 5.2;
    source.buffer = this.processedBuffer;
    source.loop = true;
    source
      .connect(gain)
      .connect(highpass)
      .connect(lowpass)
      .connect(drive)
      .connect(limiter)
      .connect(makeupGain)
      .connect(this.masterGain ?? this.audioContext.destination);

    this.climaxSource = source;

    const finished = new Promise<void>((resolve) => {
      source.onended = () => resolve();
    });

    if (signal.aborted) {
      source.stop();
      throw new DOMException("Aborted", "AbortError");
    }

    const stopTimer = window.setTimeout(() => {
      try { source.stop(); } catch { /* already stopped */ }
    }, 30000);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(stopTimer);
        try { source.stop(); } catch { /* already stopped */ }
      },
      { once: true },
    );

    source.start();

    const chant = this.speak(CLIMAX_CHANT_PHRASES.join(" "), signal, {
      rate: 1.06,
      pitch: 0.52,
      volume: 1,
    }).catch(() => undefined);

    await Promise.all([finished, chant]);
  }

  async stopAll(): Promise<void> {
    window.speechSynthesis.cancel();
    this.climaxSource?.stop();
    this.climaxSource = null;

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch {
        // Ignored during cleanup.
      }
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.processedBuffer = null;
    this.calibration = null;
    this.lastScheduledNoteAt = 0;

    this.sourceNode?.disconnect();
    this.analyser?.disconnect();
    this.sourceNode = null;
    this.analyser = null;
  }

  getSnapshot(): InstallationRuntimeSnapshot {
    return {
      selectedVoice: this.selectedVoice?.name ?? null,
      hasStream: Boolean(this.stream),
      recorderState: this.mediaRecorder?.state ?? "inactive",
      chunkCount: this.recordedChunks.length,
      passThreshold: this.calibration?.passThreshold ?? null,
      playbackReady: Boolean(this.processedBuffer),
    };
  }

  setClimaxMuted(muted: boolean): void {
    this.climaxMuted = muted;
  }

  private async ensureSynthReady(): Promise<void> {
    if (this.sampler) return;

    this.musicBoxBus = new Tone.Gain(0.94);
    this.noteHighpass = new Tone.Filter({ type: "highpass", frequency: 480, rolloff: -24 });
    this.noteLowpass = new Tone.Filter({ type: "lowpass", frequency: 5200, rolloff: -12 });
    this.reverb = new Tone.Reverb({ decay: 3.4, preDelay: 0.04, wet: 0.24 });

    this.musicBoxBus.chain(this.noteHighpass, this.noteLowpass, this.reverb, Tone.Destination);

    this.sampler = new Tone.Sampler({
      attack: 0.002,
      release: 2.4,
      urls: PIANO_SAMPLE_URLS,
      volume: -6,
    });
    this.sampler.connect(this.musicBoxBus);

    this.noteAccent = new Tone.PolySynth(Tone.Synth, {
      volume: -16,
      oscillator: { type: "triangle8" },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.18 },
    });
    this.noteAccent.connect(this.musicBoxBus);

    await Tone.loaded();
  }

  private async ensureVoiceSelected(): Promise<void> {
    if (this.selectedVoice) {
      return;
    }

    const synth = window.speechSynthesis;

    const resolveVoices = async (): Promise<SpeechSynthesisVoice[]> => {
      const existing = synth.getVoices();
      if (existing.length > 0) {
        return existing;
      }

      return new Promise((resolve) => {
        const onVoices = () => {
          synth.removeEventListener("voiceschanged", onVoices);
          resolve(synth.getVoices());
        };

        synth.addEventListener("voiceschanged", onVoices, { once: true });
      });
    };

    const voices = await resolveVoices();
    const preferredNames = [
      "Google US English",
      "Microsoft Ava Online (Natural) - English (United States)",
      "Microsoft Zira Desktop - English (United States)",
    ];

    this.selectedVoice =
      voices.find((voice) => preferredNames.includes(voice.name)) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ??
      voices[0] ??
      null;
  }

  private speak(
    text: string,
    signal: AbortSignal,
    options?: { rate?: number; pitch?: number; volume?: number },
  ): Promise<void> {
    if (!text.trim()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = options?.rate ?? 0.88;
      utterance.pitch = options?.pitch ?? 0.78;
      utterance.volume = options?.volume ?? 1;

      const onAbort = () => {
        window.speechSynthesis.cancel();
        reject(new DOMException("Aborted", "AbortError"));
      };

      utterance.onend = () => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      };

      utterance.onerror = (event) => {
        signal.removeEventListener("abort", onAbort);
        reject(event.error === "canceled" ? new DOMException("Canceled", "AbortError") : new Error(event.error));
      };

      signal.addEventListener("abort", onAbort, { once: true });
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  private currentRms(): number {
    if (!this.analyser) {
      return 0;
    }

    const data = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(data);

    let total = 0;
    for (let index = 0; index < data.length; index += 1) {
      total += data[index] * data[index];
    }

    return Math.sqrt(total / data.length);
  }

  private async calibrate(sampleWindowMs: number, durationMs: number): Promise<MicCalibrationResult> {
    const readings: number[] = [];
    const startedAt = performance.now();

    while (performance.now() - startedAt < durationMs) {
      readings.push(this.currentRms());
      await wait(sampleWindowMs);
    }

    const average =
      readings.reduce((sum, reading) => sum + reading, 0) / Math.max(1, readings.length);
    const threshold = derivePassThreshold(average, DEFAULT_GATE_CONFIG);

    const track = this.stream?.getAudioTracks()[0];
    const settings = track?.getSettings() ?? {};

    return {
      noiseFloor: average,
      passThreshold: threshold,
      supportedConstraints: supportedConstraints(),
      trackSettings: {
        echoCancellation: settings.echoCancellation,
        noiseSuppression: settings.noiseSuppression,
        autoGainControl: settings.autoGainControl,
        deviceId: settings.deviceId,
      },
      bleedRisk: "low",
    };
  }

  private async checkSpeakerBleed(threshold: number): Promise<"low" | "high"> {
    await this.ensureSynthReady();

    const baseline = this.currentRms();
    const now = Tone.now();
    this.sampler!.triggerAttackRelease("E5", 0.5, now + 0.12, 0.06);
    await wait(420);
    const after = this.currentRms();

    return detectBleedRisk({ baseline, after, threshold });
  }

  private waitForAffirmation(
    gateConfig: MicGateConfig,
    prompt: string,
    signal: AbortSignal,
    onMeter: (snapshot: MeterSnapshot) => void,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let heldMs = 0;
      let previousTime = performance.now();
      const startedAt = previousTime;

      const step = () => {
        if (signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        const now = performance.now();
        const elapsed = now - previousTime;
        previousTime = now;

        const level = this.currentRms();
        const threshold = gateConfig.minThreshold;

        if (level >= threshold) {
          heldMs += elapsed;
        } else {
          heldMs = Math.max(0, heldMs - elapsed * 0.6);
        }

        onMeter({ level, threshold, prompt });

        if (heldMs >= gateConfig.holdMs) {
          resolve(true);
          return;
        }

        if (now - startedAt >= gateConfig.maxWaitMs) {
          resolve(false);
          return;
        }

        window.setTimeout(step, gateConfig.sampleWindowMs);
      };

      step();
    });
  }

  private startRecording(): void {
    if (!this.stream || typeof MediaRecorder === "undefined") {
      return;
    }

    this.recordedChunks = [];
    const mimeType = getMediaRecorderMimeType();
    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.stream, { mimeType })
      : new MediaRecorder(this.stream);

    this.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    });

    this.mediaRecorder.start(1000);
  }

  private async buildCaptureBuffer(capture: Blob): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error("Audio context is not ready.");
    }

    const decoded = await this.decodeRecordedCapture(capture);

    if (!decoded || !this.hasAudibleBuffer(decoded)) {
      return this.createEmergencyBlastBuffer();
    }

    return decoded;
  }

  private async decodeRecordedCapture(capture: Blob): Promise<AudioBuffer | null> {
    if (!this.audioContext || capture.size === 0) {
      return null;
    }

    const arrayBuffer = await capture.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      return null;
    }

    try {
      return await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
    } catch {
      return null;
    }
  }

  private hasAudibleBuffer(
    buffer: AudioBuffer,
    minimumFrames = 4096,
    minimumPeak = 0.0012,
  ): boolean {
    if (buffer.length < minimumFrames) {
      return false;
    }

    for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex += 1) {
      if (peakLevelForSamples(buffer.getChannelData(channelIndex)) >= minimumPeak) {
        return true;
      }
    }

    return false;
  }

  private createEmergencyBlastBuffer(durationSeconds = 7.5): AudioBuffer {
    if (!this.audioContext) {
      throw new Error("Audio context is not ready.");
    }

    const frameCount = Math.ceil(durationSeconds * this.audioContext.sampleRate);
    const buffer = this.audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      const t = index / this.audioContext.sampleRate;
      const ramp = Math.min(1, t / 0.18);
      const fade = Math.max(0, 1 - Math.max(0, t - durationSeconds + 0.45) / 0.45);
      const sweep = Math.sin(2 * Math.PI * (180 + t * 1200) * t);
      const crunch = (Math.random() * 2 - 1) * 0.42;
      channel[index] = (sweep * 0.58 + crunch) * ramp * fade;
    }

    return buffer;
  }

  private stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder) {
      return Promise.resolve(new Blob());
    }

    if (this.mediaRecorder.state === "inactive") {
      return Promise.resolve(new Blob(this.recordedChunks, { type: this.mediaRecorder.mimeType || "audio/webm" }));
    }

    return new Promise((resolve) => {
      const recorder = this.mediaRecorder!;
      recorder.addEventListener(
        "stop",
        () => {
          resolve(new Blob(this.recordedChunks, { type: recorder.mimeType || "audio/webm" }));
        },
        { once: true },
      );
      recorder.stop();
    });
  }
}

class QaInstallationRuntime implements InstallationRuntime {
  private scenario = "happy";

  private speed = 1;

  private climaxMuted = false;

  private promptAttempts = new Map<string, number>();

  constructor(speed: number, scenario: string) {
    this.speed = speed;
    this.scenario = scenario;
  }

  setScenario(scenario: string): void {
    this.scenario = scenario;
    this.promptAttempts.clear();
  }

  async primeFromGesture(): Promise<void> {
    await wait(80 * this.speed);
  }

  async bootCrowdSession(): Promise<{ calibration: MicCalibrationResult; voiceName: string | null }> {
    await wait(260 * this.speed);

    if (this.scenario === "mic-denied") {
      throw new Error("Microphone access was denied.");
    }

    return {
      calibration: {
        noiseFloor: 0.012,
        passThreshold: 0.068,
        supportedConstraints: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        trackSettings: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          deviceId: "qa-device",
        },
        bleedRisk: "low",
      },
      voiceName: "QA Synthetic",
    };
  }

  async runPrompt(
    cue: CueDefinition,
    gateConfig: MicGateConfig,
    signal: AbortSignal,
    onMeter: (snapshot: MeterSnapshot) => void,
  ): Promise<void> {
    await wait(Math.max(100, cue.minPromptMs * this.speed * 0.45), signal);

    if (cue.gateKind === "none") {
      onMeter({ level: 0, threshold: 0, prompt: cue.id });
      await wait(Math.max(90, cue.minPromptMs * this.speed * 0.35), signal);
      return;
    }

    const attempt = this.promptAttempts.get(cue.id) ?? 0;
    this.promptAttempts.set(cue.id, attempt + 1);

    if (this.scenario === "quiet-first" && attempt === 0) {
      onMeter({ level: gateConfig.minThreshold * 0.45, threshold: gateConfig.minThreshold, prompt: cue.id });
      await wait(420 * this.speed, signal);
      onMeter({ level: gateConfig.minThreshold * 0.28, threshold: gateConfig.minThreshold, prompt: cue.id });
      await wait(380 * this.speed, signal);
    }

    onMeter({ level: gateConfig.minThreshold * 1.4, threshold: gateConfig.minThreshold, prompt: cue.id });
    await wait(Math.max(120, gateConfig.holdMs * this.speed), signal);
  }

  async queueMusicBoxNote(_noteIndex: number, signal: AbortSignal): Promise<void> {
    await wait(280 * this.speed, signal);
  }

  async prepareClimaxPlayback(signal: AbortSignal): Promise<ProcessedPlayback> {
    await wait(240 * this.speed, signal);
    return {
      peakLevel: 0.88,
      durationMs: 1400,
      layerCount: 10,
      source: "recorded",
    };
  }

  async playClimax(signal: AbortSignal): Promise<void> {
    await wait(this.climaxMuted ? 120 * this.speed : 700 * this.speed, signal);
  }

  async stopAll(): Promise<void> {
    await wait(40);
  }

  getSnapshot(): InstallationRuntimeSnapshot {
    return {
      selectedVoice: "QA Synthetic",
      hasStream: this.scenario !== "mic-denied",
      recorderState: this.scenario === "mic-denied" ? "inactive" : "recording",
      chunkCount: 4,
      passThreshold: 0.068,
      playbackReady: true,
    };
  }

  setClimaxMuted(muted: boolean): void {
    this.climaxMuted = muted;
  }
}

export function createInstallationRuntime(options: {
  qaEnabled: boolean;
  scenario: string;
  speed: number;
}): InstallationRuntime {
  if (options.qaEnabled) {
    return new QaInstallationRuntime(options.speed, options.scenario);
  }

  return new BrowserInstallationRuntime();
}
