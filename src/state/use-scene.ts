import { useSyncExternalStore } from 'react'
import { sceneStore } from '@/engine'

function useScene() {
  const project = useSyncExternalStore(sceneStore.onSceneChanged, sceneStore.getProject)

  return {
    project,
    environment: project.environment,
    setEnvironment: sceneStore.setEnvironment,
    setAudio: sceneStore.setAudio,
    addVideoAssets: sceneStore.addVideoAssets,
    removeVideoAsset: sceneStore.removeVideoAsset,
    addElement: sceneStore.addElement,
    updateElement: sceneStore.updateElement,
    patchElement: sceneStore.patchElement,
    removeElement: sceneStore.removeElement,
    duplicateElement: sceneStore.duplicateElement,
    setElementMeta: sceneStore.setElementMeta,
    patchElementMeta: sceneStore.patchElementMeta,
    addKeyframe: sceneStore.addKeyframe,
    removeKeyframe: sceneStore.removeKeyframe,
    clearKeyframeTrack: sceneStore.clearKeyframeTrack,
    moveKeyframe: sceneStore.moveKeyframe,
    undo: sceneStore.undo,
    redo: sceneStore.redo,
    canUndo: sceneStore.canUndo(),
    canRedo: sceneStore.canRedo(),
  }
}

export { useScene }
