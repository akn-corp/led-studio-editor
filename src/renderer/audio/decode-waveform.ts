export function computeWaveformPeaks(buffer: AudioBuffer, bucketCount: number): number[] {
  const samplesPerBucket = Math.max(1, Math.floor(buffer.length / bucketCount))
  const peaks: number[] = []

  for (let bucket = 0; bucket < bucketCount; bucket += 1) {
    const start = bucket * samplesPerBucket
    const end = Math.min(buffer.length, start + samplesPerBucket)
    let peak = 0

    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel)
      for (let i = start; i < end; i += 1) {
        const amplitude = Math.abs(data[i])
        if (amplitude > peak) peak = amplitude
      }
    }

    peaks.push(peak)
  }

  return peaks
}
