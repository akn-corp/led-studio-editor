type SceneChangedListener = () => void
type SelectionChangedListener = (selectedElementId: string | null) => void

function createEventBus() {
  const sceneChangedListeners = new Set<SceneChangedListener>()
  const selectionChangedListeners = new Set<SelectionChangedListener>()

  return {
    onSceneChanged: (listener: SceneChangedListener) => {
      sceneChangedListeners.add(listener)
      return () => sceneChangedListeners.delete(listener)
    },
    emitSceneChanged: () => {
      sceneChangedListeners.forEach((listener) => listener())
    },
    onSelectionChanged: (listener: SelectionChangedListener) => {
      selectionChangedListeners.add(listener)
      return () => selectionChangedListeners.delete(listener)
    },
    emitSelectionChanged: (selectedElementId: string | null) => {
      selectionChangedListeners.forEach((listener) => listener(selectedElementId))
    },
  }
}

export { createEventBus }
