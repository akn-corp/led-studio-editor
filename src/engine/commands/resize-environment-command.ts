import type { Command } from '@/engine/commands/command'
import type { Environment } from '@/engine/model/environment'
import type { Project } from '@/engine/model/project'

class ResizeEnvironmentCommand implements Command {
  private readonly changes: Partial<Environment>
  private previousEnvironment: Environment | null = null

  constructor(changes: Partial<Environment>) {
    this.changes = changes
  }

  execute(project: Project): Project {
    this.previousEnvironment = project.environment
    return { ...project, environment: { ...project.environment, ...this.changes } }
  }

  undo(project: Project): Project {
    if (!this.previousEnvironment) return project
    return { ...project, environment: this.previousEnvironment }
  }
}

export { ResizeEnvironmentCommand }
