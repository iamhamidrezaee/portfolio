import { CLIMAX_LAYER_SETTINGS, createPlaybackMetadata } from "@/soft-whisper/audio/playbackMath";
import type { ProcessedPlayback } from "@/soft-whisper/experience/types";

interface RenderedPlayback {
  metadata: ProcessedPlayback;
  buffer: AudioBuffer;
}

function peakLevelForBuffer(buffer: AudioBuffer): number {
  let peak = 0;

  for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex += 1) {
    const channel = buffer.getChannelData(channelIndex);

    for (let sampleIndex = 0; sampleIndex < channel.length; sampleIndex += 1) {
      peak = Math.max(peak, Math.abs(channel[sampleIndex]));
    }
  }

  return peak;
}

function normaliseBuffer(context: BaseAudioContext, input: AudioBuffer, peakTarget = 0.92): AudioBuffer {
  const peak = peakLevelForBuffer(input);

  if (peak === 0) {
    return input;
  }

  const gain = peakTarget / peak;
  const output = context.createBuffer(input.numberOfChannels, input.length, input.sampleRate);

  for (let channelIndex = 0; channelIndex < input.numberOfChannels; channelIndex += 1) {
    const source = input.getChannelData(channelIndex);
    const destination = output.getChannelData(channelIndex);

    for (let sampleIndex = 0; sampleIndex < source.length; sampleIndex += 1) {
      destination[sampleIndex] = source[sampleIndex] * gain;
    }
  }

  return output;
}

function reverseBuffer(context: BaseAudioContext, input: AudioBuffer): AudioBuffer {
  const output = context.createBuffer(input.numberOfChannels, input.length, input.sampleRate);

  for (let channelIndex = 0; channelIndex < input.numberOfChannels; channelIndex += 1) {
    const source = input.getChannelData(channelIndex);
    const destination = output.getChannelData(channelIndex);

    for (let sampleIndex = 0; sampleIndex < source.length; sampleIndex += 1) {
      destination[sampleIndex] = source[source.length - sampleIndex - 1];
    }
  }

  return output;
}

function createDriveCurve(amount = 80): Float32Array {
  const curve = new Float32Array(256);
  const radians = Math.PI / 180;

  for (let index = 0; index < curve.length; index += 1) {
    const x = (index * 2) / curve.length - 1;
    curve[index] = ((3 + amount) * x * 20 * radians) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
}

export async function renderProcessedPlayback(
  audioContext: AudioContext,
  input: AudioBuffer,
): Promise<RenderedPlayback> {
  const duration = input.duration + 1.8;

  const offlineContext = new OfflineAudioContext(
    Math.max(2, input.numberOfChannels),
    Math.ceil(duration * input.sampleRate),
    input.sampleRate,
  );

  const master = offlineContext.createGain();
  const delay = offlineContext.createDelay(1.4);
  const feedback = offlineContext.createGain();
  const delayMix = offlineContext.createGain();
  const compressor = offlineContext.createDynamicsCompressor();
  const highpass = offlineContext.createBiquadFilter();
  const lowpass = offlineContext.createBiquadFilter();
  const drive = offlineContext.createWaveShaper();

  highpass.type = "highpass";
  highpass.frequency.value = 140;
  highpass.Q.value = 0.7;

  lowpass.type = "lowpass";
  lowpass.frequency.value = 5200;
  lowpass.Q.value = 0.6;

  drive.curve = createDriveCurve(72);
  drive.oversample = "4x";

  compressor.threshold.value = -9;
  compressor.knee.value = 4;
  compressor.ratio.value = 5.5;
  compressor.attack.value = 0.001;
  compressor.release.value = 0.18;

  master.gain.value = 0.9;
  master.connect(highpass).connect(lowpass).connect(drive).connect(compressor).connect(offlineContext.destination);

  delay.delayTime.value = 0.17;
  feedback.gain.value = 0.34;
  delayMix.gain.value = 0.18;
  delay.connect(feedback).connect(delay);
  delay.connect(delayMix).connect(master);

  const reversed = reverseBuffer(offlineContext, input);

  CLIMAX_LAYER_SETTINGS.forEach((layer) => {
    const source = offlineContext.createBufferSource();
    const layerGain = offlineContext.createGain();
    const sendGain = offlineContext.createGain();
    const filter = offlineContext.createBiquadFilter();
    const panner = offlineContext.createStereoPanner();

    source.buffer = layer.rate < 0.95 || layer.rate > 1.09 ? reversed : input;
    source.playbackRate.value = layer.rate;
    layerGain.gain.value = layer.gain;
    sendGain.gain.value = 0.08 + layer.offset * 0.07;
    filter.type = layer.offset % 0.22 < 0.11 ? "bandpass" : "highpass";
    filter.frequency.value = 420 + layer.offset * 1400;
    filter.Q.value = filter.type === "bandpass" ? 1.1 : 0.72;
    panner.pan.value = Math.sin(layer.offset * 6.4) * 0.55;

    source.connect(filter).connect(layerGain).connect(panner).connect(master);
    layerGain.connect(sendGain).connect(delay);
    source.start(layer.offset);
  });

  const rendered = await offlineContext.startRendering();
  const normalised = normaliseBuffer(audioContext, rendered, 1.0);
  const peakLevel = peakLevelForBuffer(normalised);

  return {
    metadata: createPlaybackMetadata(normalised.duration * 1000, peakLevel),
    buffer: normalised,
  };
}
