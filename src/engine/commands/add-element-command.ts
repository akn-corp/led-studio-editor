import type { Command } from '@/engine/commands/command'
import type { Element } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

class AddElementCommand implements Command {
  private readonly element: Element

  constructor(element: Element) {
    this.element = element
  }

  execute(project: Project): Project {
    return { ...project, elements: [...project.elements, this.element] }
  }

  undo(project: Project): Project {
    return {
      ...project,
      elements: project.elements.filter((element) => element.id !== this.element.id),
    }
  }
}

export { AddElementCommand }
