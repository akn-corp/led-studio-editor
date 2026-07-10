import { useSyncExternalStore } from 'react'
import { displayModeStore, type DisplayMode } from '@/renderer/display-mode-store'

function useDisplayMode() {
  const mode = useSyncExternalStore(displayModeStore.subscribe, displayModeStore.getMode)

  return {
    mode,
    setMode: displayModeStore.setMode,
  }
}

export { useDisplayMode, type DisplayMode }
