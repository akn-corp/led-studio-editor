import { useSyncExternalStore } from 'react'
import { sceneStore } from '@/engine'

function useScene() {
  const project = useSyncExternalStore(sceneStore.onSceneChanged, sceneStore.getProject)

  return {
    project,
    environment: project.environment,
    setEnvironment: sceneStore.setEnvironment,
    undo: sceneStore.undo,
    redo: sceneStore.redo,
    canUndo: sceneStore.canUndo(),
    canRedo: sceneStore.canRedo(),
  }
}

export { useScene }
