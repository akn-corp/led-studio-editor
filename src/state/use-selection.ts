import { useSyncExternalStore } from 'react'
import { sceneStore } from '@/engine'

function useSelection() {
  const selectedElementId = useSyncExternalStore(
    sceneStore.onSelectionChanged,
    sceneStore.getSelectedElementId,
  )

  return {
    selectedElementId,
    select: sceneStore.setSelectedElementId,
  }
}

export { useSelection }
