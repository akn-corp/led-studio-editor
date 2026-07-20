export { sceneStore } from '@/engine/scene-store'
export { DEFAULT_ENVIRONMENT, ENVIRONMENT_LIMITS } from '@/engine/model/environment'
export type { Environment } from '@/engine/model/environment'
export type { Project } from '@/engine/model/project'
export type { AudioTrack } from '@/engine/model/audio'
export type {
  Element,
  ElementChanges,
  ElementMeta,
  SquareElement,
  TextElement,
  VideoElement,
  VideoCropRect,
} from '@/engine/model/element'
export type { VideoAsset } from '@/engine/model/video-asset'
export { createSquareElement, createTextElement, createVideoElement } from '@/engine/model/element-factory'
export type { FitMode } from '@/engine/fit-transform'
export { computeFitTransform } from '@/engine/fit-transform'
export { isPointInElement } from '@/engine/coverage'
export { getLedPreviewAppearance, hexToRgb } from '@/engine/rasterize-leds'
export type { Rgb } from '@/engine/rasterize-leds'
export { composeColorGrid, rgbToCss } from '@/engine/rasterize-scene'
export type { ColorGrid, ComposeColorGridOptions } from '@/engine/rasterize-scene'
export type {
  AnimatableProperty,
  EasingType,
  Keyframe,
  KeyframeTracks,
} from '@/engine/model/keyframe'
export {
  resolveElementAtTime,
  resolveSceneAtTime,
  isElementVisibleAt,
} from '@/engine/timeline/resolve-scene-at-time'
export {
  hasKeyframeTrack,
  getElementKeyframeTimes,
  getPropertiesKeyframedAt,
  splitTrackedChanges,
} from '@/engine/timeline/keyframe-utils'
export { DEFAULT_DURATION, getProjectDuration } from '@/engine/timeline/get-project-duration'
export { playbackStore } from '@/engine/timeline/playback-store'
export type { AnimationPreset, AnimationPresetId, PresetDelta } from '@/engine/animation-presets/types'
export { getAnimationPreset, listAnimationPresets } from '@/engine/animation-presets/presets'
export type {
  VideoAnimationPreset,
  VideoAnimationPresetId,
  VideoPresetDelta,
} from '@/engine/animation-presets/video-types'
export { getVideoAnimationPreset, listVideoAnimationPresets } from '@/engine/animation-presets/video-presets'
