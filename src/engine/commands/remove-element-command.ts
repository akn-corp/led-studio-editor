import type { Command } from '@/engine/commands/command'
import type { Element } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

class RemoveElementCommand implements Command {
  private readonly elementId: string
  private removedElement: Element | null = null
  private removedIndex = -1

  constructor(elementId: string) {
    this.elementId = elementId
  }

  execute(project: Project): Project {
    const index = project.elements.findIndex((element) => element.id === this.elementId)
    if (index === -1) return project
    this.removedElement = project.elements[index]
    this.removedIndex = index
    return {
      ...project,
      elements: project.elements.filter((element) => element.id !== this.elementId),
    }
  }

  undo(project: Project): Project {
    if (!this.removedElement) return project
    const elements = [...project.elements]
    elements.splice(this.removedIndex, 0, this.removedElement)
    return { ...project, elements }
  }
}

export { RemoveElementCommand }
