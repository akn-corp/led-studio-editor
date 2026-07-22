import type { Command } from '@/engine/commands/command'
import type { Element, ElementMeta } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

/** Covers clip move/trim, the visibility toggle, and Text's background/animation-preset fields. */
class SetElementMetaCommand implements Command {
  private readonly elementId: string
  private readonly changes: ElementMeta
  private previousMeta: ElementMeta | null = null

  constructor(elementId: string, changes: ElementMeta) {
    this.elementId = elementId
    this.changes = changes
  }

  execute(project: Project): Project {
    const elements = project.elements.map((element) => {
      if (element.id !== this.elementId) return element
      this.previousMeta = pickKeys(element, this.changes)
      return { ...element, ...this.changes } as Element
    })
    return { ...project, elements }
  }

  undo(project: Project): Project {
    if (!this.previousMeta) return project
    const previousMeta = this.previousMeta
    const elements = project.elements.map((element) =>
      element.id === this.elementId ? ({ ...element, ...previousMeta } as Element) : element,
    )
    return { ...project, elements }
  }
}

function pickKeys(element: Element, changes: ElementMeta): ElementMeta {
  const picked: Record<string, unknown> = {}
  for (const key of Object.keys(changes)) {
    picked[key] = (element as unknown as Record<string, unknown>)[key]
  }
  return picked as ElementMeta
}

export { SetElementMetaCommand }
