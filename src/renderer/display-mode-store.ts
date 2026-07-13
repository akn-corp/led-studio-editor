export type DisplayMode = 'edit' | 'simulation'

type Listener = () => void

function createDisplayModeStore() {
  let mode: DisplayMode = 'edit'
  const listeners = new Set<Listener>()

  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    getMode: () => mode,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setMode: (next: DisplayMode) => {
      if (mode === next) return
      mode = next
      emitChange()
    },
  }
}

const displayModeStore = createDisplayModeStore()

export { displayModeStore }
