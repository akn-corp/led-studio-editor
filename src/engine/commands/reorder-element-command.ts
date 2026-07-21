import type { Command } from '@/engine/commands/command'
import type { Element } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

function moveItem(elements: Element[], fromIndex: number, toIndex: number): Element[] {
  const copy = elements.slice()
  const [moved] = copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, moved)
  return copy
}

// Moves `elementId` to occupy `targetElementId`'s current position in the
// timeline's vertical track order. Resolves both indices fresh from the
// project at execute-time (rather than trusting indices captured at drag
// start), since drag-and-drop UI state can lag behind concurrent edits.
class ReorderElementCommand implements Command {
  private readonly elementId: string
  private readonly targetElementId: string
  private fromIndex = -1
  private toIndex = -1

  constructor(elementId: string, targetElementId: string) {
    this.elementId = elementId
    this.targetElementId = targetElementId
  }

  execute(project: Project): Project {
    const fromIndex = project.elements.findIndex((element) => element.id === this.elementId)
    const toIndex = project.elements.findIndex((element) => element.id === this.targetElementId)
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return project
    this.fromIndex = fromIndex
    this.toIndex = toIndex
    return { ...project, elements: moveItem(project.elements, fromIndex, toIndex) }
  }

  undo(project: Project): Project {
    if (this.fromIndex === -1) return project
    return { ...project, elements: moveItem(project.elements, this.toIndex, this.fromIndex) }
  }
}

export { ReorderElementCommand }
