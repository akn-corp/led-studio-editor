import type { Project } from '@/engine/model/project'

export interface Command {
  execute(project: Project): Project
  undo(project: Project): Project
}
