import { useSyncExternalStore } from 'react'
import { getProjectDuration, playbackStore } from '@/engine'
import { useScene } from '@/state/use-scene'

function usePlayback() {
  const { project } = useScene()
  const currentTime = useSyncExternalStore(playbackStore.subscribe, playbackStore.getCurrentTime)
  const isPlaying = useSyncExternalStore(playbackStore.subscribe, playbackStore.getIsPlaying)
  const isLoop = useSyncExternalStore(playbackStore.subscribe, playbackStore.getIsLoop)
  const duration = getProjectDuration(project)

  const seek = (time: number) => {
    playbackStore.setCurrentTime(Math.min(Math.max(time, 0), duration))
  }

  return {
    currentTime,
    isPlaying,
    isLoop,
    duration,
    play: playbackStore.play,
    pause: playbackStore.pause,
    toggle: playbackStore.toggle,
    setLoop: playbackStore.setLoop,
    seek,
  }
}

export { usePlayback }
