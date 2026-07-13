import { useCallback, useEffect, useRef, useState } from 'react'
import { sceneStore } from '@/engine'
import { createPlaybackLoop } from '@/routing'

function isPreviewAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.preview)
}

function usePreview() {
  const [isRunning, setIsRunning] = useState(false)
  const loopRef = useRef<ReturnType<typeof createPlaybackLoop> | null>(null)

  const stop = useCallback(async () => {
    loopRef.current?.stop()
    loopRef.current = null
    await window.electronAPI?.preview?.stop()
    setIsRunning(false)
  }, [])

  const start = useCallback(async () => {
    const api = window.electronAPI?.preview
    if (!api) return

    await api.start({ host: '127.0.0.1', port: 6455 })
    const loop = createPlaybackLoop({
      getProject: () => sceneStore.getProject(),
      sendFrame: (frame) => {
        void api.sendFrame(frame)
      },
      hz: 40,
    })
    loopRef.current = loop
    loop.start()
    setIsRunning(true)
  }, [])

  const toggle = useCallback(async () => {
    if (isRunning) {
      await stop()
    } else {
      await start()
    }
  }, [isRunning, start, stop])

  useEffect(() => {
    if (!isRunning) return
    return sceneStore.onSceneChanged(() => {
      loopRef.current?.flush()
    })
  }, [isRunning])

  useEffect(() => {
    return () => {
      void stop()
    }
  }, [stop])

  return {
    isRunning,
    toggle,
    available: isPreviewAvailable(),
  }
}

export { usePreview }
