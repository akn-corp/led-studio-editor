import { useSyncExternalStore } from 'react'
import { viewportStore } from '@/renderer/viewport-store'

function useViewport() {
  const state = useSyncExternalStore(viewportStore.subscribe, viewportStore.getState)

  return {
    scale: state.scale,
    position: state.position,
    size: state.size,
    contentSize: state.contentSize,
    setSize: viewportStore.setSize,
    setContentSize: viewportStore.setContentSize,
    setPosition: viewportStore.setPosition,
    zoomTo: viewportStore.zoomTo,
    fitToContent: viewportStore.fitToContent,
  }
}

export { useViewport }
