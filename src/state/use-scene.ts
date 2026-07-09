import { useSyncExternalStore } from 'react'
import { sceneStore } from '@/engine'

function useScene() {
  const project = useSyncExternalStore(sceneStore.subscribe, sceneStore.getProject)

  return {
    project,
    environment: project.environment,
    setEnvironment: sceneStore.setEnvironment,
  }
}

export { useScene }
