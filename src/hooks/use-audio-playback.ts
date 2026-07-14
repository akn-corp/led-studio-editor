import { useEffect, useRef } from 'react'
import { toLocalFileUrl } from '@/lib/utils'
import { usePlayback } from '@/state/use-playback'

// How far the <audio> element's own clock may drift from the timeline's
// currentTime before we force it back in sync — catches loop restarts and
// scrub jumps without fighting the audio element's native playback clock
// on every rAF tick.
const SYNC_DRIFT_THRESHOLD = 0.15

/**
 * Plays the attached reference file synced to the shared timeline clock
 * (`usePlayback`): play/pause follows `isPlaying`, and `currentTime` is
 * mirrored in whenever it drifts (playhead scrub, loop restart, initial
 * seek before play).
 */
function useAudioPlayback(filePath: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isPlaying, currentTime, toggle } = usePlayback()

  useEffect(() => {
    if (!filePath) {
      audioRef.current = null
      return
    }

    const audio = new Audio(toLocalFileUrl(filePath))
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [filePath])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) void audio.play()
    else audio.pause()
  }, [isPlaying, filePath])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (Math.abs(audio.currentTime - currentTime) > SYNC_DRIFT_THRESHOLD) {
      audio.currentTime = currentTime
    }
  }, [currentTime])

  return { isPlaying, toggle }
}

export { useAudioPlayback }
