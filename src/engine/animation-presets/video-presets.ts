import type { VideoAnimationPreset, VideoAnimationPresetId, VideoPresetDelta } from '@/engine/animation-presets/video-types'

const SLIDE_DISTANCE = 8 // grid units

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

const presets: VideoAnimationPreset[] = [
  {
    id: 'fade',
    label: 'Fade',
    enter: (p): VideoPresetDelta => ({ opacityFactor: clamp01(p) }),
  },
  {
    id: 'scale',
    label: 'Scale',
    enter: (p): VideoPresetDelta => ({ sizeFactor: Math.max(clamp01(p), 0.05), opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideLeft',
    label: 'Slide Left',
    enter: (p): VideoPresetDelta => ({ x: (1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideRight',
    label: 'Slide Right',
    enter: (p): VideoPresetDelta => ({ x: -(1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
]

const presetsById = new Map<VideoAnimationPresetId, VideoAnimationPreset>(
  presets.map((preset) => [preset.id, preset]),
)

function getVideoAnimationPreset(id: VideoAnimationPresetId | null | undefined): VideoAnimationPreset | null {
  if (!id) return null
  return presetsById.get(id) ?? null
}

function listVideoAnimationPresets(): VideoAnimationPreset[] {
  return presets
}

export { getVideoAnimationPreset, listVideoAnimationPresets }
