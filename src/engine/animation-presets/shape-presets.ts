import type {
  ShapeAnimationPreset,
  ShapeAnimationPresetId,
  ShapePresetDelta,
} from '@/engine/animation-presets/shape-types'

const SLIDE_DISTANCE = 8 // grid units
const SPIN_LOOP_SPEED = 120 // degrees / second
const WOBBLE_LOOP_SPEED = 4 // radians / second
const WOBBLE_LOOP_AMPLITUDE = 6 // degrees
const BOUNCE_LOOP_SPEED = 5 // radians / second
const BOUNCE_LOOP_AMPLITUDE = 1.2 // grid units
const PULSE_LOOP_SPEED = 4 // radians / second
const PULSE_LOOP_AMPLITUDE = 0.08 // fraction of size

// Simplified easeOutBounce, used only by the `bounce` preset's enter curve.
function easeOutBounce(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  return n1 * (t -= 2.625 / d1) * t + 0.984375
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

const presets: ShapeAnimationPreset[] = [
  {
    id: 'fade',
    label: 'Fade',
    enter: (p): ShapePresetDelta => ({ opacityFactor: clamp01(p) }),
  },
  {
    id: 'scale',
    label: 'Scale',
    enter: (p): ShapePresetDelta => ({ sizeFactor: Math.max(clamp01(p), 0.05), opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideUp',
    label: 'Slide Up',
    enter: (p): ShapePresetDelta => ({ y: (1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideDown',
    label: 'Slide Down',
    enter: (p): ShapePresetDelta => ({ y: -(1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideLeft',
    label: 'Slide Left',
    enter: (p): ShapePresetDelta => ({ x: (1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideRight',
    label: 'Slide Right',
    enter: (p): ShapePresetDelta => ({ x: -(1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'bounce',
    label: 'Bounce',
    supportsLoop: true,
    enter: (p): ShapePresetDelta => {
      const t = clamp01(p)
      return { y: (1 - easeOutBounce(t)) * SLIDE_DISTANCE, opacityFactor: Math.min(t * 3, 1) }
    },
    loop: (elapsed): ShapePresetDelta => ({
      y: Math.abs(Math.sin(elapsed * BOUNCE_LOOP_SPEED)) * -BOUNCE_LOOP_AMPLITUDE,
    }),
  },
  {
    id: 'spin',
    label: 'Spin',
    supportsLoop: true,
    enter: (p): ShapePresetDelta => {
      const t = clamp01(p)
      return { rotation: (1 - t) * 360, opacityFactor: t }
    },
    loop: (elapsed): ShapePresetDelta => ({ rotation: (elapsed * SPIN_LOOP_SPEED) % 360 }),
  },
  {
    id: 'wobble',
    label: 'Wobble',
    supportsLoop: true,
    enter: (p): ShapePresetDelta => {
      const t = clamp01(p)
      return { rotation: Math.sin(t * Math.PI * 3) * (1 - t) * 15, opacityFactor: t }
    },
    loop: (elapsed): ShapePresetDelta => ({
      rotation: Math.sin(elapsed * WOBBLE_LOOP_SPEED) * WOBBLE_LOOP_AMPLITUDE,
    }),
  },
  {
    id: 'pulse',
    label: 'Pulse',
    supportsLoop: true,
    enter: (p): ShapePresetDelta => ({ opacityFactor: clamp01(p) }),
    loop: (elapsed): ShapePresetDelta => ({
      sizeFactor: 1 + Math.sin(elapsed * PULSE_LOOP_SPEED) * PULSE_LOOP_AMPLITUDE,
    }),
  },
]

const presetsById = new Map<ShapeAnimationPresetId, ShapeAnimationPreset>(
  presets.map((preset) => [preset.id, preset]),
)

function getShapeAnimationPreset(id: ShapeAnimationPresetId | null | undefined): ShapeAnimationPreset | null {
  if (!id) return null
  return presetsById.get(id) ?? null
}

function listShapeAnimationPresets(options: { loopOnly?: boolean } = {}): ShapeAnimationPreset[] {
  return options.loopOnly ? presets.filter((preset) => preset.supportsLoop) : presets
}

export { getShapeAnimationPreset, listShapeAnimationPresets }
