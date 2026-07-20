import type { KeyframeTracks } from '@/engine/model/keyframe'
import type { AnimationPresetId } from '@/engine/animation-presets/types'
import type { VideoAnimationPresetId } from '@/engine/animation-presets/video-types'
import type { FitMode } from '@/engine/fit-transform'

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

export interface VideoCropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface VideoElement extends BaseElement {
  type: 'video'
  fileName: string
  filePath: string
  sourceDuration: number
  thumbnailDataUrl: string | null
  volume: number
  muted: boolean
  playbackSpeed: number
  fit: FitMode
  /** Normalized 0-1 rect within the source frame; null = full frame. */
  crop: VideoCropRect | null
  filterPreset: 'none'
  borderRadius: number
  brightness: number
  enterAnimation: VideoAnimationPresetId | null
  exitAnimation: VideoAnimationPresetId | null
}

export type Element = SquareElement | TextElement | VideoElement

/**
 * "Structural" fields — not keyframeable, mutated via SetElementMetaCommand
 * instead of UpdateElementCommand/AddKeyframeCommand. `enterAnimation`/
 * `exitAnimation` are widened to accept either registry's ids explicitly
 * (rather than via Pick, which would intersect Text's and Video's distinct
 * id unions down to only their overlapping literals).
 */
export type ElementMeta = Partial<
  Pick<SquareElement, 'startTime' | 'duration' | 'hidden'> &
    Pick<TextElement, 'backgroundColor' | 'loopAnimation'> &
    Pick<
      VideoElement,
      'volume' | 'muted' | 'playbackSpeed' | 'fit' | 'crop' | 'filterPreset' | 'borderRadius' | 'brightness'
    >
> & {
  enterAnimation?: AnimationPresetId | VideoAnimationPresetId | null
  exitAnimation?: AnimationPresetId | VideoAnimationPresetId | null
}

// enterAnimation/exitAnimation are meta-only (see ElementMeta above) — excluded
// here too, for the same reason: Text's and Video's id unions would otherwise
// collide down to only their overlapping literals.
export type ElementChanges = Partial<Omit<SquareElement, 'id' | 'type'>> &
  Partial<Omit<TextElement, 'id' | 'type' | 'enterAnimation' | 'loopAnimation' | 'exitAnimation'>> &
  Partial<Omit<VideoElement, 'id' | 'type' | 'enterAnimation' | 'exitAnimation'>>
