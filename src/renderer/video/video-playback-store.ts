// Plain module store (no React) mapping elementId -> the hidden <video> DOM
// element VideoPlaybackManager owns for it. VideoNode (Konva preview) and
// composeColorGrid's caller (environment-grid.tsx) both read from here
// instead of each managing their own video element — one decode per video.
const videoElements = new Map<string, HTMLVideoElement>()

function registerVideo(elementId: string, video: HTMLVideoElement) {
  videoElements.set(elementId, video)
}

function unregisterVideo(elementId: string) {
  videoElements.delete(elementId)
}

function getVideoElement(elementId: string): HTMLVideoElement | null {
  return videoElements.get(elementId) ?? null
}

export { registerVideo, unregisterVideo, getVideoElement }
