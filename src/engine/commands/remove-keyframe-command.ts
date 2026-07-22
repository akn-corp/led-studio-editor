import type { Command } from '@/engine/commands/command'
import { KEYFRAME_TIME_EPSILON, type AnimatableProperty, type Keyframe } from '@/engine/model/keyframe'
import type { Project } from '@/engine/model/project'

/** Pass `time` to remove a single keyframe, or omit it to clear the whole track. */
class RemoveKeyframeCommand implements Command {
  private readonly elementId: string
  private readonly property: AnimatableProperty
  private readonly time?: number
  private previousTrack: Keyframe[] | null = null

  constructor(elementId: string, property: AnimatableProperty, time?: number) {
    this.elementId = elementId
    this.property = property
    this.time = time
  }

  execute(project: Project): Project {
    const elements = project.elements.map((element) => {
      if (element.id !== this.elementId) return element

      const track = element.keyframes[this.property] ?? []
      this.previousTrack = track

      const nextTrack =
        this.time === undefined
          ? []
          : track.filter((keyframe) => Math.abs(keyframe.time - this.time!) > KEYFRAME_TIME_EPSILON)

      const keyframes = { ...element.keyframes }
      if (nextTrack.length === 0) delete keyframes[this.property]
      else keyframes[this.property] = nextTrack

      return { ...element, keyframes }
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

export { RemoveKeyframeCommand }
