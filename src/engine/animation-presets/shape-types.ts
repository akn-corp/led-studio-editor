import type { ShapeElement } from '@/engine/model/element'

export type ShapeAnimationPresetId =
  | 'fade'
  | 'scale'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'bounce'
  | 'spin'
  | 'wobble'
  | 'pulse'

export interface ShapePresetDelta {
  x?: number
  y?: number
  rotation?: number
  opacityFactor?: number
  sizeFactor?: number
}

export interface ShapeAnimationPreset {
  id: ShapeAnimationPresetId
  label: string
  /** Whether this preset is offered in the Loop picker (defines `loop`). */
  supportsLoop?: boolean
  /**
   * progress: 0 (not yet visible/settled) -> 1 (fully entered).
   * Reused for exit by passing a progress that runs 1 -> 0 as the clip ends,
   * same technique as the text/video preset registries.
   */
  enter(progress: number, element: ShapeElement): ShapePresetDelta
  /** elapsedSeconds: time since the clip's startTime, unbounded — periodic. */
  loop?(elapsedSeconds: number, element: ShapeElement): ShapePresetDelta
}
