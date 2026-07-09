import { createHistoryManager } from '@/engine/commands/history-manager'
import { ResizeEnvironmentCommand } from '@/engine/commands/resize-environment-command'
import { createEventBus } from '@/engine/events/event-bus'
import { DEFAULT_ENVIRONMENT, type Environment } from '@/engine/model/environment'
import type { Project } from '@/engine/model/project'

function createDefaultProject(): Project {
  return {
    id: 'demo-project',
    name: 'Untitled Project',
    environment: { ...DEFAULT_ENVIRONMENT },
    elements: [],
  }
}

function createSceneStore() {
  let project = createDefaultProject()
  let selectedElementId: string | null = null
  const events = createEventBus()

  const history = createHistoryManager({
    getProject: () => project,
    setProject: (next) => {
      project = next
      events.emitSceneChanged()
    },
  })

  return {
    getProject: () => project,
    onSceneChanged: events.onSceneChanged,

    getSelectedElementId: () => selectedElementId,
    onSelectionChanged: events.onSelectionChanged,
    setSelectedElementId: (id: string | null) => {
      selectedElementId = id
      events.emitSelectionChanged(id)
    },

    setEnvironment: (environment: Partial<Environment>) => {
      history.execute(new ResizeEnvironmentCommand(environment))
    },

    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  }
}

const sceneStore = createSceneStore()

export { sceneStore }
