import type { AnimationPreset, AnimationPresetId, PresetDelta } from '@/engine/animation-presets/types'

const SLIDE_DISTANCE = 8 // grid units
const SPIN_LOOP_SPEED = 120 // degrees / second
const WOBBLE_LOOP_SPEED = 4 // radians / second
const WOBBLE_LOOP_AMPLITUDE = 6 // degrees
const BOUNCE_LOOP_SPEED = 5 // radians / second
const BOUNCE_LOOP_AMPLITUDE = 1.2 // grid units
const PULSE_LOOP_SPEED = 4 // radians / second
const PULSE_LOOP_AMPLITUDE = 0.08 // fraction of fontSize

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

const presets: AnimationPreset[] = [
  {
    id: 'fade',
    label: 'Fade',
    enter: (p): PresetDelta => ({ opacityFactor: clamp01(p) }),
  },
  {
    id: 'scale',
    label: 'Scale',
    enter: (p): PresetDelta => ({ fontSizeFactor: Math.max(clamp01(p), 0.05) }),
  },
  {
    id: 'slideUp',
    label: 'Slide Up',
    enter: (p): PresetDelta => ({ y: (1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideDown',
    label: 'Slide Down',
    enter: (p): PresetDelta => ({ y: -(1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideLeft',
    label: 'Slide Left',
    enter: (p): PresetDelta => ({ x: (1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'slideRight',
    label: 'Slide Right',
    enter: (p): PresetDelta => ({ x: -(1 - clamp01(p)) * SLIDE_DISTANCE, opacityFactor: clamp01(p) }),
  },
  {
    id: 'bounce',
    label: 'Bounce',
    supportsLoop: true,
    enter: (p): PresetDelta => {
      const t = clamp01(p)
      return { y: (1 - easeOutBounce(t)) * SLIDE_DISTANCE, opacityFactor: Math.min(t * 3, 1) }
    },
    loop: (elapsed): PresetDelta => ({
      y: Math.abs(Math.sin(elapsed * BOUNCE_LOOP_SPEED)) * -BOUNCE_LOOP_AMPLITUDE,
    }),
  },
  {
    id: 'spin',
    label: 'Spin',
    supportsLoop: true,
    enter: (p): PresetDelta => {
      const t = clamp01(p)
      return { rotation: (1 - t) * 360, opacityFactor: t }
    },
    loop: (elapsed): PresetDelta => ({ rotation: (elapsed * SPIN_LOOP_SPEED) % 360 }),
  },
  {
    id: 'wobble',
    label: 'Wobble',
    supportsLoop: true,
    enter: (p): PresetDelta => {
      const t = clamp01(p)
      return { rotation: Math.sin(t * Math.PI * 3) * (1 - t) * 15, opacityFactor: t }
    },
    loop: (elapsed): PresetDelta => ({
      rotation: Math.sin(elapsed * WOBBLE_LOOP_SPEED) * WOBBLE_LOOP_AMPLITUDE,
    }),
  },
  {
    id: 'pulse',
    label: 'Pulse',
    supportsLoop: true,
    enter: (p): PresetDelta => ({ opacityFactor: clamp01(p) }),
    loop: (elapsed): PresetDelta => ({
      fontSizeFactor: 1 + Math.sin(elapsed * PULSE_LOOP_SPEED) * PULSE_LOOP_AMPLITUDE,
    }),
  },
  {
    id: 'typing',
    label: 'Typing',
    enter: (p, element): PresetDelta => {
      const count = Math.round(element.text.length * clamp01(p))
      return { text: element.text.slice(0, count) }
    },
  },
]

const presetsById = new Map<AnimationPresetId, AnimationPreset>(presets.map((preset) => [preset.id, preset]))

function getAnimationPreset(id: AnimationPresetId | null | undefined): AnimationPreset | null {
  if (!id) return null
  return presetsById.get(id) ?? null
}

function listAnimationPresets(options: { loopOnly?: boolean } = {}): AnimationPreset[] {
  return options.loopOnly ? presets.filter((preset) => preset.supportsLoop) : presets
}

export { getAnimationPreset, listAnimationPresets }
