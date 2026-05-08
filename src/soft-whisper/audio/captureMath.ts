export function mergeCaptureChunks(chunks: Float32Array[]): Float32Array {
  const totalFrames = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(totalFrames);

  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });

  return merged;
}

export function peakLevelForSamples(samples: Float32Array): number {
  let peak = 0;

  for (let index = 0; index < samples.length; index += 1) {
    peak = Math.max(peak, Math.abs(samples[index]));
  }

  return peak;
}

export function hasAudibleCapture(
  samples: Float32Array,
  minimumFrames = 4096,
  minimumPeak = 0.0012,
): boolean {
  return samples.length >= minimumFrames && peakLevelForSamples(samples) >= minimumPeak;
}
