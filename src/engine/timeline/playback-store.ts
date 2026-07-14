type Listener = () => void

function createPlaybackStore() {
  let currentTime = 0
  let isPlaying = false
  let isLoop = false
  const listeners = new Set<Listener>()

  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    getCurrentTime: () => currentTime,
    getIsPlaying: () => isPlaying,
    getIsLoop: () => isLoop,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setCurrentTime: (time: number) => {
      currentTime = Math.max(0, time)
      emitChange()
    },
    play: () => {
      if (isPlaying) return
      isPlaying = true
      emitChange()
    },
    pause: () => {
      if (!isPlaying) return
      isPlaying = false
      emitChange()
    },
    toggle: () => {
      isPlaying = !isPlaying
      emitChange()
    },
    setLoop: (next: boolean) => {
      if (isLoop === next) return
      isLoop = next
      emitChange()
    },
  }
}

const playbackStore = createPlaybackStore()

export { playbackStore }
