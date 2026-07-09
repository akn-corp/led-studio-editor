import { clamp } from '@/lib/utils'
import { MAX_SCALE, MIN_SCALE, VIEWPORT_PADDING } from '@/renderer/constants'

export interface ViewportPoint {
  x: number
  y: number
}

interface ViewportSize {
  width: number
  height: number
}

interface ViewportState {
  scale: number
  position: ViewportPoint
  size: ViewportSize
  contentSize: ViewportSize
}

type Listener = () => void

function createViewportStore() {
  let state: ViewportState = {
    scale: 1,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    contentSize: { width: 0, height: 0 },
  }
  const listeners = new Set<Listener>()

  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setSize: (size: ViewportSize) => {
      state = { ...state, size }
      emitChange()
    },
    setContentSize: (contentSize: ViewportSize) => {
      state = { ...state, contentSize }
      emitChange()
    },
    setPosition: (position: ViewportPoint) => {
      state = { ...state, position }
      emitChange()
    },
    zoomTo: (nextScale: number, focalPoint?: ViewportPoint) => {
      const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      const focal = focalPoint ?? { x: state.size.width / 2, y: state.size.height / 2 }

      const pointTo = {
        x: (focal.x - state.position.x) / state.scale,
        y: (focal.y - state.position.y) / state.scale,
      }

      state = {
        ...state,
        scale,
        position: {
          x: focal.x - pointTo.x * scale,
          y: focal.y - pointTo.y * scale,
        },
      }
      emitChange()
    },
    fitToContent: () => {
      const { size, contentSize } = state
      const availableWidth = size.width - VIEWPORT_PADDING * 2
      const availableHeight = size.height - VIEWPORT_PADDING * 2
      if (availableWidth <= 0 || availableHeight <= 0) return
      if (contentSize.width === 0 || contentSize.height === 0) return

      const scale = clamp(
        Math.min(availableWidth / contentSize.width, availableHeight / contentSize.height),
        MIN_SCALE,
        MAX_SCALE,
      )

      state = {
        ...state,
        scale,
        position: {
          x: (size.width - contentSize.width * scale) / 2,
          y: (size.height - contentSize.height * scale) / 2,
        },
      }
      emitChange()
    },
  }
}

const viewportStore = createViewportStore()

export { viewportStore }
