import { useEffect, useState } from 'react'
import { toLocalFileUrl } from '@/lib/utils'
import { computeWaveformPeaks } from '@/renderer/audio/decode-waveform'

const WAVEFORM_BUCKET_COUNT = 400

// Decoding is a one-shot cost per file, not per render — cache by path so
// re-mounting the timeline row (zoom, panel toggles, etc.) doesn't re-decode.
const waveformCache = new Map<string, number[]>()

function useAudioWaveform(filePath: string | null) {
  const [peaks, setPeaks] = useState<number[] | null>(
    filePath ? (waveformCache.get(filePath) ?? null) : null,
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!filePath) {
      setPeaks(null)
      setIsLoading(false)
      return
    }

    const cached = waveformCache.get(filePath)
    if (cached) {
      setPeaks(cached)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setPeaks(null)
    setIsLoading(true)
    const path = filePath

    async function decode() {
      try {
        const response = await fetch(toLocalFileUrl(path))
        const arrayBuffer = await response.arrayBuffer()
        const audioContext = new AudioContext()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        await audioContext.close()
        const computed = computeWaveformPeaks(audioBuffer, WAVEFORM_BUCKET_COUNT)

        if (cancelled) return
        waveformCache.set(path, computed)
        setPeaks(computed)
      } catch (error) {
        console.error('[audio] failed to decode waveform:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void decode()

    return () => {
      cancelled = true
    }
  }, [filePath])

  return { peaks, isLoading }
}

export { useAudioWaveform }
