import { useEffect, useRef } from 'react'
import { isElementVisibleAt, type VideoElement } from '@/engine'
import { clamp, toLocalFileUrl } from '@/lib/utils'
import { registerVideo, unregisterVideo } from '@/renderer/video/video-playback-store'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'

// Same drift-correction technique as use-audio-playback.ts.
const SYNC_DRIFT_THRESHOLD = 0.15

/**
 * Owns one hidden <video> per video element in the project (for as long as
 * the element exists, not just while its clip is visible — avoids
 * reload/flicker every time the playhead crosses a clip boundary), synced
 * to the shared timeline clock. Mounted once, always — unlike ElementsLayer,
 * which unmounts entirely in simulation display mode — so a video element's
 * decoded frame is available to both the Konva preview (edit mode) and the
 * LED color grid (both display modes) via video-playback-store.
 */
function VideoPlaybackManager() {
  const { project } = useScene()
  const { currentTime, isPlaying } = usePlayback()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videosRef = useRef(new Map<string, HTMLVideoElement>())

  const videoElements = project.elements.filter(
    (element): element is VideoElement => element.type === 'video',
  )
  const videoElementIds = videoElements.map((element) => element.id).join(',')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const currentIds = new Set(videoElements.map((element) => element.id))

    for (const element of videoElements) {
      if (videosRef.current.has(element.id)) continue
      const video = document.createElement('video')
      // Must be set before `src` — lets drawImage/getImageData read this
      // video's frames for the LED grid without tainting the canvas.
      video.crossOrigin = 'anonymous'
      video.src = toLocalFileUrl(element.filePath)
      video.playsInline = true
      video.style.position = 'fixed'
      video.style.width = '1px'
      video.style.height = '1px'
      video.style.opacity = '0'
      video.style.pointerEvents = 'none'
      container.appendChild(video)
      videosRef.current.set(element.id, video)
      registerVideo(element.id, video)
    }

    for (const [id, video] of videosRef.current) {
      if (currentIds.has(id)) continue
      video.pause()
      video.remove()
      videosRef.current.delete(id)
      unregisterVideo(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- videoElementIds is the intentional identity key
  }, [videoElementIds])

  useEffect(() => {
    for (const element of videoElements) {
      const video = videosRef.current.get(element.id)
      if (!video) continue

      video.muted = element.muted
      video.volume = element.volume

      const visible = isElementVisibleAt(element, currentTime)
      const mappedTime = clamp(
        (currentTime - element.startTime) * element.playbackSpeed,
        0,
        element.sourceDuration,
      )

      if (visible && isPlaying) {
        if (Math.abs(video.currentTime - mappedTime) > SYNC_DRIFT_THRESHOLD) {
          video.currentTime = mappedTime
        }
        void video.play()
      } else {
        video.pause()
        if (visible) video.currentTime = mappedTime
      }
    }
  })

  useEffect(() => {
    const videos = videosRef.current
    return () => {
      for (const [id, video] of videos) {
        video.pause()
        video.remove()
        unregisterVideo(id)
      }
      videos.clear()
    }
  }, [])

  return <div ref={containerRef} />
}

export { VideoPlaybackManager }
