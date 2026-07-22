import { useEffect } from 'react'
import { playbackStore } from '@/engine'
import { usePlayback } from '@/state/use-playback'

/** Drives `currentTime` forward via rAF while playing. Mount once (in EditorTimeline). */
function useTimelineClock() {
  const { isPlaying, isLoop, duration, pause } = usePlayback()

  useEffect(() => {
    if (!isPlaying) return

    let frame: number
    let last = performance.now()

    const tick = (now: number) => {
      const delta = (now - last) / 1000
      last = now

      const next = playbackStore.getCurrentTime() + delta
      if (next >= duration) {
        if (isLoop) {
          playbackStore.setCurrentTime(0)
        } else {
          playbackStore.setCurrentTime(duration)
          pause()
          return
        }
      } else {
        playbackStore.setCurrentTime(next)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, isLoop, duration, pause])
}

export { useTimelineClock }
