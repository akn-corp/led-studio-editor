import type { Command } from '@/engine/commands/command'
import type { Element, ElementChanges } from '@/engine/model/element'
import { resolveElementChanges } from '@/engine/model/element-changes'
import type { Project } from '@/engine/model/project'

class UpdateElementCommand implements Command {
  private readonly elementId: string
  private readonly changes: ElementChanges
  private previousElement: Element | null = null

  constructor(elementId: string, changes: ElementChanges) {
    this.elementId = elementId
    this.changes = changes
  }

  execute(project: Project): Project {
    const elements = project.elements.map((element) => {
      if (element.id !== this.elementId) return element
      this.previousElement = element
      const changes = resolveElementChanges(element, this.changes)
      return { ...element, ...changes } as Element
    })
    return { ...project, elements }
  }

  undo(project: Project): Project {
    if (!this.previousElement) return project
    const previousElement = this.previousElement
    const elements = project.elements.map((element) =>
      element.id === this.elementId ? previousElement : element,
    )
    return { ...project, elements }
  }
}

export { UpdateElementCommand }
