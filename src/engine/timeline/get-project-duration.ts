import type { Project } from '@/engine/model/project'

const DEFAULT_DURATION = 10

function getProjectDuration(project: Project): number {
  let duration = Math.max(DEFAULT_DURATION, project.audio?.duration ?? 0)

  for (const element of project.elements) {
    for (const track of Object.values(element.keyframes)) {
      if (!track || track.length === 0) continue
      duration = Math.max(duration, track[track.length - 1].time)
    }
  }

  return duration
}

export { DEFAULT_DURATION, getProjectDuration }
