import { useCallback, useEffect, useRef, useState } from 'react'
import { applyWallMapping } from '@/engine/apply-wall-mapping'
import { fetchHubWallBands } from '@/engine/hub-config-client'
import { createPlaybackLoop } from '@/engine/playback-loop'
import { sceneStore } from '@/engine/scene-store'
import { getHubSettings } from '@/state/use-hub-settings'

function isPreviewAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.preview)
}

function usePreview() {
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
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

    const settings = getHubSettings()

    if (settings.syncOnPreviewStart) {
      try {
        const wallBands = await fetchHubWallBands(settings.configBaseUrl)
        await applyWallMapping(wallBands)
        setStatus(`Hub sync OK · ${settings.stateHost}:${settings.statePort}`)
      } catch (err) {
        setStatus(
          `Hub offline — cache local · ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    } else {
      setStatus(`${settings.stateHost}:${settings.statePort}`)
    }

    await api.start({ host: settings.stateHost, port: settings.statePort })
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
    status,
  }
}

export { usePreview }
