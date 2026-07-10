import { rasterizeLedFrame } from '@/engine/rasterize-leds'
import type { Project } from '@/engine/model/project'

export interface StateFrame {
  frameId: number
  entries: ReturnType<typeof rasterizeLedFrame>
}

export interface PlaybackLoopOptions {
  getProject: () => Project
  sendFrame: (frame: StateFrame) => void | Promise<void>
  hz?: number
}

export function createPlaybackLoop(options: PlaybackLoopOptions) {
  const hz = options.hz ?? 40
  let interval: ReturnType<typeof setInterval> | null = null
  let frameId = 0

  async function tick() {
    const entries = rasterizeLedFrame(options.getProject())
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
