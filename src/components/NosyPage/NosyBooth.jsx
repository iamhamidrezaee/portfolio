import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './NosyPage.css';

const TOTAL_SHOTS = 4;
const COUNTDOWN_FROM = 3;
const CAPTURE_DELAY_MS = 760;
const FLASH_MS = 190;
const CAPTURE_SIZE = 640;
const STRIP_PHOTO = 310;
const STRIP_GAP = 14;
const STRIP_PAD = 30;
const STRIP_FOOTER = 58;
const STRIP_WIDTH = STRIP_PAD * 2 + STRIP_PHOTO * 2 + STRIP_GAP;
const STRIP_HEIGHT = STRIP_PAD * 2 + STRIP_PHOTO * 2 + STRIP_GAP + STRIP_FOOTER;

const FRAME_DESIGNS = [
  {
    id: 'contact',
    name: 'Contact',
    paper: '#050505',
    ink: '#f7f4ee',
    line: 'rgba(247,244,238,0.18)',
    accent: '#f7f4ee',
  },
  {
    id: 'proof',
    name: 'Proof',
    paper: '#f4f0e8',
    ink: '#070707',
    line: 'rgba(7,7,7,0.18)',
    accent: '#3f3d38',
  },
  {
    id: 'redacted',
    name: 'Redacted',
    paper: '#090908',
    ink: '#e8e1d5',
    line: 'rgba(232,225,213,0.16)',
    accent: '#7d1f1a',
  },
];

const initialQuestions = ['', '', ''];

const makeSessionId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `nosy-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getFrameDesign = (id) => FRAME_DESIGNS.find((design) => design.id === id) || FRAME_DESIGNS[0];

const loadImageSource = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load image.'));
    image.src = src;
  });

const canvasToDataUrl = (canvas, type = 'image/png', quality) =>
  new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(canvas.toDataURL(type, quality));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(blob);
      },
      type,
      quality,
    );
  });

const drawCroppedImage = (ctx, image, targetWidth, targetHeight, mirror = false) => {
  const sourceWidth = image.videoWidth || image.naturalWidth || image.width || 1;
  const sourceHeight = image.videoHeight || image.naturalHeight || image.height || 1;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  let cropX = 0;
  let cropY = 0;

  if (sourceRatio > targetRatio) {
    cropWidth = sourceHeight * targetRatio;
    cropX = (sourceWidth - cropWidth) / 2;
  } else {
    cropHeight = sourceWidth / targetRatio;
    cropY = (sourceHeight - cropHeight) * 0.38;
  }

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.save();
  if (mirror) {
    ctx.translate(targetWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);
  ctx.restore();
};

const drawStripBackground = (ctx, design) => {
  ctx.fillStyle = design.paper;
  ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

  ctx.save();
  ctx.strokeStyle = design.line;
  ctx.lineWidth = 1;
  for (let x = 18; x < STRIP_WIDTH; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, STRIP_HEIGHT);
    ctx.stroke();
  }
  for (let y = 18; y < STRIP_HEIGHT; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STRIP_WIDTH, y);
    ctx.stroke();
  }

  if (design.id === 'redacted') {
    ctx.fillStyle = design.accent;
    ctx.globalAlpha = 0.68;
    ctx.fillRect(0, 0, 12, STRIP_HEIGHT);
    ctx.fillRect(STRIP_WIDTH - 12, 0, 12, STRIP_HEIGHT);
  }

  if (design.id === 'proof') {
    ctx.fillStyle = 'rgba(7,7,7,0.08)';
    for (let y = 0; y < STRIP_HEIGHT; y += 28) {
      ctx.fillRect(0, y, STRIP_WIDTH, 1);
    }
  }
  ctx.restore();
};

const drawPhotoMat = (ctx, design, x, y, index) => {
  ctx.save();
  ctx.fillStyle = design.id === 'proof' ? '#fbf8f0' : '#0b0b0a';
  ctx.fillRect(x - 7, y - 7, STRIP_PHOTO + 14, STRIP_PHOTO + 14);
  ctx.strokeStyle = design.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 7.5, y - 7.5, STRIP_PHOTO + 15, STRIP_PHOTO + 15);
  ctx.fillStyle = design.ink;
  ctx.globalAlpha = design.id === 'proof' ? 0.35 : 0.42;
  ctx.font = '10px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(index + 1).padStart(2, '0'), x, y - 12);
  ctx.restore();
};

const drawPhotoOverlay = (ctx, design, x, y) => {
  ctx.save();
  ctx.strokeStyle = design.id === 'proof' ? 'rgba(7,7,7,0.24)' : 'rgba(247,244,238,0.24)';
  ctx.lineWidth = 1;
  const mark = 18;
  const inset = 10;
  [
    [x + inset, y + inset, mark, 0],
    [x + inset, y + inset, 0, mark],
    [x + STRIP_PHOTO - inset, y + inset, -mark, 0],
    [x + STRIP_PHOTO - inset, y + inset, 0, mark],
    [x + inset, y + STRIP_PHOTO - inset, mark, 0],
    [x + inset, y + STRIP_PHOTO - inset, 0, -mark],
    [x + STRIP_PHOTO - inset, y + STRIP_PHOTO - inset, -mark, 0],
    [x + STRIP_PHOTO - inset, y + STRIP_PHOTO - inset, 0, -mark],
  ].forEach(([mx, my, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx + dx, my + dy);
    ctx.stroke();
  });
  ctx.restore();
};

const composeStrip = async ({ frames, frameId, sessionId }) => {
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not compose strip.');

  const design = getFrameDesign(frameId);
  drawStripBackground(ctx, design);
  const images = await Promise.all(frames.map((frame) => loadImageSource(frame.dataUrl)));
  const positions = [
    [STRIP_PAD, STRIP_PAD],
    [STRIP_PAD + STRIP_PHOTO + STRIP_GAP, STRIP_PAD],
    [STRIP_PAD, STRIP_PAD + STRIP_PHOTO + STRIP_GAP],
    [STRIP_PAD + STRIP_PHOTO + STRIP_GAP, STRIP_PAD + STRIP_PHOTO + STRIP_GAP],
  ];

  images.forEach((image, index) => {
    const [x, y] = positions[index];
    drawPhotoMat(ctx, design, x, y, index);
    ctx.drawImage(image, x, y, STRIP_PHOTO, STRIP_PHOTO);
    drawPhotoOverlay(ctx, design, x, y);
  });

  const footerY = STRIP_HEIGHT - 28;
  ctx.save();
  ctx.fillStyle = design.ink;
  ctx.globalAlpha = design.id === 'proof' ? 0.55 : 0.62;
  ctx.font = '11px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`NOSY / ${sessionId.slice(0, 8).toUpperCase()}`, STRIP_WIDTH / 2, footerY);
  ctx.restore();

  return canvasToDataUrl(canvas, 'image/png');
};

const frameScore = (dataUrl) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const sample = document.createElement('canvas');
      sample.width = 80;
      sample.height = 80;
      const ctx = sample.getContext('2d');
      ctx.drawImage(image, 0, 0, sample.width, sample.height);
      const data = ctx.getImageData(0, 0, sample.width, sample.height).data;
      let total = 0;
      let totalSq = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
        total += lum;
        totalSq += lum * lum;
      }
      const count = data.length / 4;
      const brightness = total / count;
      const contrast = Math.sqrt(Math.max(0, totalSq / count - brightness * brightness));
      resolve(Math.round(clamp((contrast / 55) * 100 + (100 - Math.abs(brightness - 128)) * 0.25, 0, 100)));
    };
    image.onerror = () => resolve(0);
    image.src = dataUrl;
  });

const FrameSelector = ({ selectedFrame, onSelect, disabled }) => (
  <div className="nosy-frame-picker" aria-label="Frame design">
    {FRAME_DESIGNS.map((design) => (
      <button
        className={`nosy-frame-choice nosy-frame-choice-${design.id}${selectedFrame === design.id ? ' is-selected' : ''}`}
        type="button"
        key={design.id}
        aria-pressed={selectedFrame === design.id}
        disabled={disabled}
        onClick={() => onSelect(design.id)}
      >
        <span aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <strong>{design.name}</strong>
      </button>
    ))}
  </div>
);

const NosyBooth = ({ variant = 'full' }) => {
  const [sessionId, setSessionId] = useState(makeSessionId);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('intro');
  const [cameraState, setCameraState] = useState('idle');
  const [frameId, setFrameId] = useState('contact');
  const [frames, setFrames] = useState([]);
  const [stripDataUrl, setStripDataUrl] = useState('');
  const [questions, setQuestions] = useState(initialQuestions);
  const [countdown, setCountdown] = useState(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [flash, setFlash] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const streamRef = useRef(null);
  const runTokenRef = useRef(0);

  const canSubmit = fullName.trim().length >= 2 && isValidEmail(email);
  const isBusy = mode === 'shooting' || mode === 'processing';
  const isCompact = variant === 'compact';

  const attachStreamToVideo = useCallback(async () => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return false;

    if (video.srcObject !== stream) video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    try {
      await video.play();
    } catch (_err) {
      return false;
    }

    if (video.videoWidth > 0 && video.videoHeight > 0) return true;

    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        cleanup();
        resolve(video.videoWidth > 0 && video.videoHeight > 0);
      }, 2600);
      const onReady = () => {
        cleanup();
        resolve(true);
      };
      const cleanup = () => {
        window.clearTimeout(timeout);
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('playing', onReady);
      };
      video.addEventListener('loadedmetadata', onReady, { once: true });
      video.addEventListener('playing', onReady, { once: true });
    });
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState('idle');
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (!streamRef.current) return;
    void attachStreamToVideo().then((ready) => {
      if (ready) setCameraState('ready');
    });
  }, [attachStreamToVideo, mode]);

  const requestCamera = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('blocked');
      setMode('upload');
      return;
    }

    setCameraState('requesting');
    setMode('camera');

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      streamRef.current = stream;
      const ready = await attachStreamToVideo();
      setCameraState(ready ? 'ready' : 'warming');
    } catch (_err) {
      stopCamera();
      setCameraState('blocked');
      setMode('upload');
      setError('Camera was blocked. Upload photos instead.');
    }
  };

  const handleIntroSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Enter a name and email first.');
      return;
    }
    await requestCamera();
  };

  const captureFrame = async (id) => {
    const video = videoRef.current;
    if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
      throw new Error('Camera is not ready yet.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not capture photo.');
    drawCroppedImage(ctx, video, canvas.width, canvas.height, true);
    const dataUrl = await canvasToDataUrl(canvas, 'image/jpeg', 0.86);
    const confidence = await frameScore(dataUrl);
    return { id, dataUrl, confidence };
  };

  const runQuestions = async ({ token, strip }) => {
    const response = await fetch('/api/nosy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        sessionId,
      }),
    });

    if (!response.ok) throw new Error('The booth stalled.');
    const payload = await response.json();
    if (runTokenRef.current !== token) return;

    const nextQuestions = [payload.Q1, payload.Q2, payload.Q3].map((question) => String(question || '').trim());
    if (nextQuestions.some((question) => !question)) throw new Error('The booth printed a blank.');
    setQuestions(nextQuestions);
    setMode('reveal');

    sendStripEmail(strip, nextQuestions);
  };

  const sendStripEmail = (strip, nextQuestions) => {
    void fetch('/api/nosy-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        sessionId,
        stripDataUrl: strip,
        questions: nextQuestions,
      }),
    }).catch(() => undefined);
  };

  const finishWithFrames = async (nextFrames) => {
    const token = Date.now();
    runTokenRef.current = token;
    setMode('processing');
    setError('');
    setProgress(5);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => (current >= 91 ? current : current + Math.max(1, Math.round((92 - current) * 0.08))));
    }, 520);

    let strip = '';
    try {
      strip = await composeStrip({ frames: nextFrames, frameId, sessionId });
      if (runTokenRef.current !== token) return;
      setStripDataUrl(strip);
      setProgress(28);
      await runQuestions({ token, strip });
      setProgress(100);
    } catch (err) {
      if (runTokenRef.current !== token) return;
      const fallbackQuestions = [
        'What did you think would happen after giving a stranger booth your name?',
        'Why did a camera make the form feel less like a form?',
        'Where did the fun end and the permission begin?',
      ];
      setQuestions(fallbackQuestions);
      if (strip) sendStripEmail(strip, fallbackQuestions);
      setMode('reveal');
    } finally {
      window.clearInterval(progressTimer);
    }
  };

  const startSequence = async () => {
    if (isBusy || cameraState !== 'ready') return;

    const ready = await attachStreamToVideo();
    if (!ready) {
      setError('Camera is still warming up.');
      setCameraState('warming');
      return;
    }

    const token = Date.now();
    runTokenRef.current = token;
    setMode('shooting');
    setFrames([]);
    setStripDataUrl('');
    setQuestions(initialQuestions);
    setError('');
    setCurrentShot(0);

    const nextFrames = [];
    try {
      for (let shot = 1; shot <= TOTAL_SHOTS; shot += 1) {
        if (runTokenRef.current !== token) return;
        setCurrentShot(shot);
        for (let count = COUNTDOWN_FROM; count >= 1; count -= 1) {
          setCountdown(count);
          await sleep(CAPTURE_DELAY_MS);
        }
        setCountdown(null);
        setFlash(true);
        await sleep(FLASH_MS);
        const frame = await captureFrame(shot);
        nextFrames.push(frame);
        setFrames([...nextFrames]);
        setFlash(false);
        await sleep(260);
      }
      stopCamera();
      await finishWithFrames(nextFrames);
    } catch (err) {
      setFlash(false);
      setMode('camera');
      setError(err.message || 'The camera missed the shot.');
    }
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, TOTAL_SHOTS);
    if (!files.length) return;

    setMode('processing');
    setFrames([]);
    setError('');
    stopCamera();

    try {
      const nextFrames = await Promise.all(
        files.map(async (file, index) => {
          const src = URL.createObjectURL(file);
          try {
            const image = await loadImageSource(src);
            const canvas = document.createElement('canvas');
            canvas.width = CAPTURE_SIZE;
            canvas.height = CAPTURE_SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not read upload.');
            drawCroppedImage(ctx, image, canvas.width, canvas.height, false);
            const dataUrl = await canvasToDataUrl(canvas, 'image/jpeg', 0.86);
            const confidence = await frameScore(dataUrl);
            return { id: index + 1, dataUrl, confidence };
          } finally {
            URL.revokeObjectURL(src);
          }
        }),
      );

      while (nextFrames.length < TOTAL_SHOTS) {
        nextFrames.push({ ...nextFrames[nextFrames.length - 1], id: nextFrames.length + 1 });
      }

      setFrames(nextFrames);
      await finishWithFrames(nextFrames);
    } catch (err) {
      setMode('upload');
      setError(err.message || 'Could not read the upload.');
    } finally {
      if (uploadRef.current) uploadRef.current.value = '';
    }
  };

  const resetBooth = () => {
    runTokenRef.current = Date.now();
    stopCamera();
    setSessionId(makeSessionId());
    setFullName('');
    setEmail('');
    setMode('intro');
    setFrameId('contact');
    setFrames([]);
    setStripDataUrl('');
    setQuestions(initialQuestions);
    setCountdown(null);
    setCurrentShot(0);
    setFlash(false);
    setProgress(0);
    setError('');
  };

  const thumbnailSlots = useMemo(
    () =>
      Array.from({ length: TOTAL_SHOTS }, (_, index) => {
        const frame = frames[index];
        return (
          <div className={`nosy-thumb${frame ? ' is-filled' : ''}`} key={`thumb-${index}`}>
            {frame ? <img src={frame.dataUrl} alt="" /> : <span>{index + 1}</span>}
          </div>
        );
      }),
    [frames],
  );

  return (
    <section
      className={`nosy-booth nosy-booth-${variant}${flash ? ' is-flashing' : ''}${mode === 'processing' ? ' is-processing' : ''}${mode === 'intro' ? ' is-intro' : ''}`}
      aria-label="Nosy photo booth"
    >
      <div className="nosy-camera-shell">
        <div className="nosy-lens-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="nosy-viewfinder">
          {mode === 'intro' && (
            <form className="nosy-entry" onSubmit={handleIntroSubmit}>
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>
              <FrameSelector selectedFrame={frameId} onSelect={setFrameId} disabled={false} />
              <button type="submit" disabled={!canSubmit}>Begin</button>
            </form>
          )}

          {(mode === 'camera' || mode === 'shooting') && (
            <>
              <video ref={videoRef} className="nosy-video" autoPlay playsInline muted />
              {cameraState !== 'ready' && (
                <div className="nosy-fallback">
                  <span>{cameraState === 'requesting' ? 'Opening camera' : 'Camera warming'}</span>
                </div>
              )}
              {countdown && (
                <div className="nosy-countdown" aria-live="assertive">
                  {countdown}
                </div>
              )}
              <div className="nosy-shot-badge">{mode === 'shooting' ? `${currentShot} / ${TOTAL_SHOTS}` : ''}</div>
              <div className="nosy-crop-marks" aria-hidden="true" />
            </>
          )}

          {mode === 'upload' && (
            <div className="nosy-entry nosy-upload-state">
              <FrameSelector selectedFrame={frameId} onSelect={setFrameId} disabled={false} />
              <label className="nosy-file-button">
                Upload photos
                <input ref={uploadRef} type="file" accept="image/*" multiple onChange={handleUpload} />
              </label>
              <button type="button" onClick={requestCamera}>Try camera again</button>
            </div>
          )}

          {mode === 'processing' && (
            <div className="nosy-processing" role="status" aria-live="polite">
              <span>Processing your photos...</span>
              <div className="nosy-progress">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {mode === 'reveal' && (
            <div className="nosy-reveal">
              <div className="nosy-question-stack">
                {questions.map((question, index) => (
                  <article className="nosy-question is-visible" key={`q-${index}`}>
                    <small>Q{index + 1}</small>
                    <p>{question}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {(mode === 'camera' || mode === 'shooting') && (
          <div className="nosy-controls">
            <FrameSelector selectedFrame={frameId} onSelect={setFrameId} disabled={mode === 'shooting'} />
            <button type="button" onClick={startSequence} disabled={cameraState !== 'ready' || mode === 'shooting'}>
              Start
            </button>
            <label className="nosy-upload">
              Upload
              <input ref={uploadRef} type="file" accept="image/*" multiple onChange={handleUpload} />
            </label>
          </div>
        )}
      </div>

      {mode !== 'intro' && mode !== 'processing' && (
        <aside className="nosy-strip" aria-label="Photo strip">
          <div className="nosy-thumb-row">{thumbnailSlots}</div>
          <div className="nosy-strip-preview">
            {stripDataUrl ? <img src={stripDataUrl} alt="Nosy photo strip" /> : <span>NOSY</span>}
          </div>
          <button className="nosy-reset" type="button" onClick={resetBooth} disabled={mode === 'shooting'}>
            Reset
          </button>
        </aside>
      )}

      {error && (
        <p className={isCompact ? 'nosy-compact-status' : 'nosy-error'} role="alert">{error}</p>
      )}
    </section>
  );
};

export default NosyBooth;
