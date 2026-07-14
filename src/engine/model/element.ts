import type { KeyframeTracks } from '@/engine/model/keyframe'
import type { AnimationPresetId } from '@/engine/animation-presets/types'

interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  keyframes: KeyframeTracks
  /** Seconds — when this clip starts being visible on the timeline. */
  startTime: number
  /** Seconds — how long this clip lasts. */
  duration: number
  /** Timeline eye-icon toggle — hidden clips are excluded from resolveSceneAtTime without being deleted. */
  hidden: boolean
}

export interface SquareElement extends BaseElement {
  type: 'square'
  fill: string
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  fill: string
  backgroundColor: string | null
  enterAnimation: AnimationPresetId | null
  loopAnimation: AnimationPresetId | null
  exitAnimation: AnimationPresetId | null
}

export type Element = SquareElement | TextElement

/** "Structural" fields — not keyframeable, mutated via SetElementMetaCommand instead of UpdateElementCommand/AddKeyframeCommand. */
export type ElementMeta = Partial<
  Pick<SquareElement, 'startTime' | 'duration' | 'hidden'> &
    Pick<TextElement, 'backgroundColor' | 'enterAnimation' | 'loopAnimation' | 'exitAnimation'>
>

export type ElementChanges = Partial<Omit<SquareElement, 'id' | 'type'>> &
  Partial<Omit<TextElement, 'id' | 'type'>>
