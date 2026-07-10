import { AddElementCommand } from '@/engine/commands/add-element-command'
import { createHistoryManager } from '@/engine/commands/history-manager'
import { RemoveElementCommand } from '@/engine/commands/remove-element-command'
import { ResizeEnvironmentCommand } from '@/engine/commands/resize-environment-command'
import { UpdateElementCommand } from '@/engine/commands/update-element-command'
import { createEventBus } from '@/engine/events/event-bus'
import { DEFAULT_ENVIRONMENT, type Environment } from '@/engine/model/environment'
import type { Element, ElementChanges, TextElement } from '@/engine/model/element'
import { mergeTextElementChanges } from '@/engine/text-metrics'
import type { Project } from '@/engine/model/project'

const DUPLICATE_OFFSET = 0.5

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
    addElement: (element: Element) => {
      history.execute(new AddElementCommand(element))
    },
    updateElement: (elementId: string, changes: ElementChanges) => {
      history.execute(new UpdateElementCommand(elementId, changes))
    },
    /** Live update without history — used during drag/transform for real-time preview. */
    patchElement: (elementId: string, changes: ElementChanges) => {
      const elements = project.elements.map((element) => {
        if (element.id !== elementId) return element
        const merged =
          element.type === 'text'
            ? mergeTextElementChanges(element as TextElement, changes)
            : changes
        return { ...element, ...merged } as Element
      })
      project = { ...project, elements }
      events.emitSceneChanged()
    },
    removeElement: (elementId: string) => {
      history.execute(new RemoveElementCommand(elementId))
    },
    duplicateElement: (elementId: string): string | null => {
      const original = project.elements.find((element) => element.id === elementId)
      if (!original) return null
      const duplicate: Element = {
        ...original,
        id: crypto.randomUUID(),
        x: original.x + DUPLICATE_OFFSET,
        y: original.y + DUPLICATE_OFFSET,
      }
      history.execute(new AddElementCommand(duplicate))
      return duplicate.id
    },

    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  }
}

const sceneStore = createSceneStore()

export { sceneStore }
