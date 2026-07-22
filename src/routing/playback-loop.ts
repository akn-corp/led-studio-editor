import type { Project } from '@/engine'
import { rasterizeWallFrame } from '@/routing/rasterize-wall-frame'

export interface StateFrame {
  frameId: number
  entries: ReturnType<typeof rasterizeWallFrame>
}

export interface PlaybackLoopOptions {
  getProject: () => Project
  getCurrentTime: () => number
  sendFrame: (frame: StateFrame) => void | Promise<void>
  hz?: number
}

export function createPlaybackLoop(options: PlaybackLoopOptions) {
  const hz = options.hz ?? 40
  let interval: ReturnType<typeof setInterval> | null = null
  let frameId = 0

  async function tick() {
    const entries = rasterizeWallFrame(options.getProject(), options.getCurrentTime())
    await options.sendFrame({ frameId, entries })
    frameId = (frameId + 1) % 65536
  }

  return {
    start() {
      if (interval) return
      const ms = Math.max(1, Math.round(1000 / hz))
      void tick()
      interval = setInterval(() => {
        void tick()
      }, ms)
    },
    stop() {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    },
    isRunning() {
      return interval !== null
    },
    flush() {
      void tick()
    },
  }
}
