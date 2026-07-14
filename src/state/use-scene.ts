import { useSyncExternalStore } from 'react'
import { sceneStore } from '@/engine'

function useScene() {
  const project = useSyncExternalStore(sceneStore.onSceneChanged, sceneStore.getProject)

  return {
    project,
    environment: project.environment,
    setEnvironment: sceneStore.setEnvironment,
    setAudio: sceneStore.setAudio,
    addElement: sceneStore.addElement,
    updateElement: sceneStore.updateElement,
    patchElement: sceneStore.patchElement,
    removeElement: sceneStore.removeElement,
    duplicateElement: sceneStore.duplicateElement,
    undo: sceneStore.undo,
    redo: sceneStore.redo,
    canUndo: sceneStore.canUndo(),
    canRedo: sceneStore.canRedo(),
  }
}

export { useScene }
