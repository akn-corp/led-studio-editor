import { expect, test } from 'vitest'
import { resolveElementAtTime } from '@/engine/timeline/resolve-scene-at-time'
import type { SquareElement } from '@/engine/model/element'

function makeSquare(overrides: Partial<SquareElement> = {}): SquareElement {
  return {
    id: 'square-1',
    type: 'square',
    x: 0,
    y: 0,
    width: 4,
    height: 4,
    rotation: 0,
    opacity: 1,
    fill: '#000000',
    keyframes: {},
    ...overrides,
  }
}

test('a property with no keyframes stays at its base value at any time', () => {
  const element = makeSquare({ x: 5 })
  expect(resolveElementAtTime(element, 0).x).toBe(5)
  expect(resolveElementAtTime(element, 3).x).toBe(5)
})

test('a single keyframe holds its value constant across time', () => {
  const element = makeSquare({
    x: 5,
    keyframes: { x: [{ time: 2, value: 10, easing: 'linear' }] },
  })
  expect(resolveElementAtTime(element, 0).x).toBe(10)
  expect(resolveElementAtTime(element, 2).x).toBe(10)
  expect(resolveElementAtTime(element, 5).x).toBe(10)
})

test('two keyframes interpolate linearly between them and clamp outside the range', () => {
  const element = makeSquare({
    keyframes: {
      x: [
        { time: 0, value: 0, easing: 'linear' },
        { time: 2, value: 10, easing: 'linear' },
      ],
    },
  })
  expect(resolveElementAtTime(element, -1).x).toBe(0)
  expect(resolveElementAtTime(element, 0).x).toBe(0)
  expect(resolveElementAtTime(element, 1).x).toBe(5)
  expect(resolveElementAtTime(element, 2).x).toBe(10)
  expect(resolveElementAtTime(element, 5).x).toBe(10)
})

test('easeInOut is not linear at the midpoint', () => {
  const element = makeSquare({
    keyframes: {
      x: [
        { time: 0, value: 0, easing: 'easeInOut' },
        { time: 2, value: 10, easing: 'easeInOut' },
      ],
    },
  })
  expect(resolveElementAtTime(element, 0.5).x).toBeCloseTo(1.25, 5)
  expect(resolveElementAtTime(element, 1).x).toBe(5)
})

test('color properties interpolate per-channel', () => {
  const element = makeSquare({
    fill: '#000000',
    keyframes: {
      fill: [
        { time: 0, value: '#000000', easing: 'linear' },
        { time: 2, value: '#ffffff', easing: 'linear' },
      ],
    },
  })
  expect(resolveElementAtTime(element, 1).fill).toBe('#808080')
})

test('unrelated properties are left untouched when only one track is animated', () => {
  const element = makeSquare({
    y: 7,
    keyframes: { x: [{ time: 1, value: 9, easing: 'linear' }] },
  })
  const resolved = resolveElementAtTime(element, 1)
  expect(resolved.x).toBe(9)
  expect(resolved.y).toBe(7)
})
