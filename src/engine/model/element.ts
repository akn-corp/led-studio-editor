import type { KeyframeTracks } from '@/engine/model/keyframe'
import type { AnimationPresetId } from '@/engine/animation-presets/types'
import type { VideoAnimationPresetId } from '@/engine/animation-presets/video-types'
import type { ShapeAnimationPresetId } from '@/engine/animation-presets/shape-types'
import type { FitMode } from '@/engine/fit-transform'
import type { ShapeKind } from '@/engine/shapes/shape-registry'

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
  /** Multiplier applied to Enter/Loop/Exit preset animation timing — 1 = normal speed. */
  animationSpeed: number
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeKind: ShapeKind
  fill: string
  enterAnimation: ShapeAnimationPresetId | null
  loopAnimation: ShapeAnimationPresetId | null
  exitAnimation: ShapeAnimationPresetId | null
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

export type Element = ShapeElement | TextElement | VideoElement

/**
 * "Structural" fields — not keyframeable, mutated via SetElementMetaCommand
 * instead of UpdateElementCommand/AddKeyframeCommand. `enterAnimation`/
 * `loopAnimation`/`exitAnimation` are widened to accept whichever registries'
 * ids are actually in play (rather than via Pick, which would intersect
 * Shape's/Text's/Video's distinct id unions down to only their overlapping
 * literals).
 */
export type ElementMeta = Partial<
  Pick<ShapeElement, 'startTime' | 'duration' | 'hidden' | 'animationSpeed'> &
    Pick<TextElement, 'backgroundColor'> &
    Pick<
      VideoElement,
      'volume' | 'muted' | 'playbackSpeed' | 'fit' | 'crop' | 'filterPreset' | 'borderRadius' | 'brightness'
    >
> & {
  enterAnimation?: AnimationPresetId | VideoAnimationPresetId | ShapeAnimationPresetId | null
  loopAnimation?: AnimationPresetId | ShapeAnimationPresetId | null
  exitAnimation?: AnimationPresetId | VideoAnimationPresetId | ShapeAnimationPresetId | null
}

// enterAnimation/loopAnimation/exitAnimation are meta-only (see ElementMeta
// above) — excluded here too, for the same reason: Shape's/Text's/Video's id
// unions would otherwise collide down to only their overlapping literals.
export type ElementChanges = Partial<
  Omit<ShapeElement, 'id' | 'type' | 'enterAnimation' | 'loopAnimation' | 'exitAnimation'>
> &
  Partial<Omit<TextElement, 'id' | 'type' | 'enterAnimation' | 'loopAnimation' | 'exitAnimation'>> &
  Partial<Omit<VideoElement, 'id' | 'type' | 'enterAnimation' | 'exitAnimation'>>
