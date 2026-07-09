import type { Command } from '@/engine/commands/command'
import type { Project } from '@/engine/model/project'

interface HistoryManagerOptions {
  getProject: () => Project
  setProject: (project: Project) => void
}

function createHistoryManager({ getProject, setProject }: HistoryManagerOptions) {
  const undoStack: Command[] = []
  const redoStack: Command[] = []

  return {
    execute: (command: Command) => {
      setProject(command.execute(getProject()))
      undoStack.push(command)
      redoStack.length = 0
    },
    undo: () => {
      const command = undoStack.pop()
      if (!command) return
      setProject(command.undo(getProject()))
      redoStack.push(command)
    },
    redo: () => {
      const command = redoStack.pop()
      if (!command) return
      setProject(command.execute(getProject()))
      undoStack.push(command)
    },
    canUndo: () => undoStack.length > 0,
    canRedo: () => redoStack.length > 0,
  }
}

export { createHistoryManager }
