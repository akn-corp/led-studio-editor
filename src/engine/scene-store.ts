import { DEFAULT_ENVIRONMENT, type Environment } from '@/engine/model/environment'
import type { Project } from '@/engine/model/project'

type Listener = () => void

function createDefaultProject(): Project {
  return {
    id: 'demo-project',
    name: 'Untitled Project',
    environment: { ...DEFAULT_ENVIRONMENT },
  }
}

function createSceneStore() {
  let project = createDefaultProject()
  const listeners = new Set<Listener>()

  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    getProject: () => project,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setEnvironment: (environment: Partial<Environment>) => {
      project = { ...project, environment: { ...project.environment, ...environment } }
      emitChange()
    },
  }
}

// Direct mutation for now — Phase 2 replaces this with Command/HistoryManager
// so environment/element edits become undoable.
const sceneStore = createSceneStore()

export { sceneStore }
