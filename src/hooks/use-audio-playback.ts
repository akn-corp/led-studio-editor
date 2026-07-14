import { useEffect, useRef, useState } from 'react'
import { toLocalFileUrl } from '@/lib/utils'

/**
 * Standalone preview playback for the attached reference file — plays it in
 * isolation, not synced to any timeline clock (there isn't one yet; that's
 * the timeline/keyframes phase). Lets you actually hear what you attached
 * in the meantime.
 */
function useAudioPlayback(filePath: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
    if (!filePath) {
      audioRef.current = null
      return
    }

    const audio = new Audio(toLocalFileUrl(filePath))
    audio.addEventListener('ended', () => {
      audio.currentTime = 0
      setIsPlaying(false)
    })
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [filePath])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      void audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return { isPlaying, toggle }
}

export { useAudioPlayback }
