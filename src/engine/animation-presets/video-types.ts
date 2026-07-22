import type { VideoElement } from '@/engine/model/element'

export type VideoAnimationPresetId = 'fade' | 'scale' | 'slideLeft' | 'slideRight'

export interface VideoPresetDelta {
  x?: number
  y?: number
  opacityFactor?: number
  sizeFactor?: number
}

export interface VideoAnimationPreset {
  id: VideoAnimationPresetId
  label: string
  /**
   * progress: 0 (not yet visible/settled) -> 1 (fully entered).
   * Reused for exit by passing a progress that runs 1 -> 0 as the clip ends,
   * same technique as the text preset registry.
   */
  enter(progress: number, element: VideoElement): VideoPresetDelta
}
