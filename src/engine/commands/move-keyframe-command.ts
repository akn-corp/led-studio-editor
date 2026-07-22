import type { Command } from '@/engine/commands/command'
import { KEYFRAME_TIME_EPSILON, type AnimatableProperty, type Keyframe } from '@/engine/model/keyframe'
import type { Project } from '@/engine/model/project'

class MoveKeyframeCommand implements Command {
  private readonly elementId: string
  private readonly property: AnimatableProperty
  private readonly fromTime: number
  private readonly toTime: number
  private previousTrack: Keyframe[] | null = null

  constructor(elementId: string, property: AnimatableProperty, fromTime: number, toTime: number) {
    this.elementId = elementId
    this.property = property
    this.fromTime = fromTime
    this.toTime = toTime
  }

  execute(project: Project): Project {
    const elements = project.elements.map((element) => {
      if (element.id !== this.elementId) return element

      const track = element.keyframes[this.property] ?? []
      this.previousTrack = track

      const nextTrack = track
        .map((keyframe) =>
          Math.abs(keyframe.time - this.fromTime) <= KEYFRAME_TIME_EPSILON
            ? { ...keyframe, time: this.toTime }
            : keyframe,
        )
        .sort((a, b) => a.time - b.time)

      return { ...element, keyframes: { ...element.keyframes, [this.property]: nextTrack } }
    })

    return { ...project, elements }
  }

  undo(project: Project): Project {
    if (!this.previousTrack) return project
    const previousTrack = this.previousTrack
    const elements = project.elements.map((element) =>
      element.id === this.elementId
        ? { ...element, keyframes: { ...element.keyframes, [this.property]: previousTrack } }
        : element,
    )
    return { ...project, elements }
  }
}

export { MoveKeyframeCommand }
