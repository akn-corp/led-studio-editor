import type { Command } from '@/engine/commands/command'
import {
  KEYFRAME_TIME_EPSILON,
  type AnimatableProperty,
  type EasingType,
  type Keyframe,
} from '@/engine/model/keyframe'
import type { Project } from '@/engine/model/project'

class AddKeyframeCommand implements Command {
  private readonly elementId: string
  private readonly property: AnimatableProperty
  private readonly time: number
  private readonly value: number | string
  private readonly easing: EasingType
  private previousTrack: Keyframe[] | null = null

  constructor(
    elementId: string,
    property: AnimatableProperty,
    time: number,
    value: number | string,
    easing: EasingType = 'linear',
  ) {
    this.elementId = elementId
    this.property = property
    this.time = time
    this.value = value
    this.easing = easing
  }

  execute(project: Project): Project {
    const elements = project.elements.map((element) => {
      if (element.id !== this.elementId) return element

      const track = element.keyframes[this.property] ?? []
      this.previousTrack = track

      const existingIndex = track.findIndex(
        (keyframe) => Math.abs(keyframe.time - this.time) <= KEYFRAME_TIME_EPSILON,
      )
      const keyframe: Keyframe = { time: this.time, value: this.value, easing: this.easing }
      const nextTrack =
        existingIndex >= 0
          ? track.map((existing, index) => (index === existingIndex ? keyframe : existing))
          : [...track, keyframe].sort((a, b) => a.time - b.time)

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

export { AddKeyframeCommand }
