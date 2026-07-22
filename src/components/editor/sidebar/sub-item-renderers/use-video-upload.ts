import { useCallback, useRef, type ChangeEvent } from 'react'
import type { VideoAsset } from '@/engine'
import { toLocalFileUrl } from '@/lib/utils'
import { useScene } from '@/state/use-scene'

const THUMBNAIL_WIDTH = 320

function loadVideoMetadata(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    // Must be set before `src` — lets drawImage/toDataURL read this video's
    // frames for the thumbnail without tainting the canvas.
    video.crossOrigin = 'anonymous'
    video.src = url
    video.addEventListener('loadedmetadata', () => resolve(video), { once: true })
    video.addEventListener('error', () => reject(new Error('failed to load video metadata')), {
      once: true,
    })
  })
}

function captureFrame(video: HTMLVideoElement): Promise<string | null> {
  return new Promise((resolve) => {
    const seekTime = Math.min(1, video.duration / 2)
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked)
      try {
        const scale = THUMBNAIL_WIDTH / video.videoWidth
        const canvas = document.createElement('canvas')
        canvas.width = THUMBNAIL_WIDTH
        canvas.height = Math.round(video.videoHeight * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch {
        resolve(null)
      }
    }
    video.addEventListener('seeked', onSeeked, { once: true })
    video.currentTime = Number.isFinite(seekTime) ? seekTime : 0
  })
}

async function readVideoAsset(file: File): Promise<VideoAsset | null> {
  const filePath = window.electronAPI?.getPathForFile?.(file)
  if (!filePath) {
    console.error('[video] could not resolve a file path — is this running in Electron?')
    return null
  }

  try {
    const video = await loadVideoMetadata(toLocalFileUrl(filePath))
    const thumbnailDataUrl = await captureFrame(video)
    return {
      id: crypto.randomUUID(),
      fileName: file.name,
      filePath,
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      sizeBytes: file.size,
      thumbnailDataUrl,
    }
  } catch (error) {
    console.error('[video] failed to read metadata:', error)
    return null
  }
}

function useVideoUpload() {
  const { addVideoAssets } = useScene()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFilesSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      event.target.value = ''
      if (files.length === 0) return

      const assets = (await Promise.all(files.map(readVideoAsset))).filter(
        (asset): asset is VideoAsset => asset !== null,
      )
      if (assets.length > 0) addVideoAssets(assets)
    },
    [addVideoAssets],
  )

  return { inputRef, openPicker, handleFilesSelected }
}

export { useVideoUpload }
