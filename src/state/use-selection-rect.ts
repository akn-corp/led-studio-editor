import { useSyncExternalStore } from 'react'
import { selectionRectStore } from '@/renderer/selection-rect-store'

function useSelectionRect() {
  return useSyncExternalStore(selectionRectStore.subscribe, selectionRectStore.getRect)
}

export { useSelectionRect }
