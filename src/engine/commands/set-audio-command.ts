import type { Command } from '@/engine/commands/command'
import type { AudioTrack } from '@/engine/model/audio'
import type { Project } from '@/engine/model/project'

class SetAudioCommand implements Command {
  private readonly audio: AudioTrack | null
  private previousAudio: AudioTrack | null | undefined

  constructor(audio: AudioTrack | null) {
    this.audio = audio
  }

  execute(project: Project): Project {
    this.previousAudio = project.audio
    return { ...project, audio: this.audio }
  }

  undo(project: Project): Project {
    if (this.previousAudio === undefined) return project
    return { ...project, audio: this.previousAudio }
  }
}

export { SetAudioCommand }
