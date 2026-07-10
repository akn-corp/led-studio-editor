export interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

type Listener = () => void

function createSelectionRectStore() {
  let rect: SelectionRect | null = null
  const listeners = new Set<Listener>()

  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    getRect: () => rect,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setRect: (next: SelectionRect | null) => {
      rect = next
      emitChange()
    },
  }
}

const selectionRectStore = createSelectionRectStore()

export { selectionRectStore }
