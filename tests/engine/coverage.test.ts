import { expect, test } from 'vitest'
import { isPointInElement } from '@/engine/coverage'
import type { ShapeElement } from '@/engine/model/element'

function makeShape(overrides: Partial<ShapeElement> = {}): ShapeElement {
  return {
    id: 'shape-1',
    type: 'shape',
    shapeKind: 'square',
    x: 0,
    y: 0,
    width: 8,
    height: 8,
    rotation: 0,
    opacity: 1,
    fill: '#000000',
    keyframes: {},
    startTime: 0,
    duration: 10,
    hidden: false,
    animationSpeed: 1,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
    ...overrides,
  }
}

test('rotation pivots around the shape center: the center point stays inside at every angle', () => {
  const base = makeShape({ x: 3, y: 5, width: 6, height: 2 })
  const center = { x: base.x + base.width / 2, y: base.y + base.height / 2 }
  for (const rotation of [0, 15, 45, 90, 180, 233]) {
    expect(isPointInElement(center.x, center.y, { ...base, rotation })).toBe(true)
  }
})

test('a point near the top-left corner exits the shape once rotated, proving the pivot is not (x, y)', () => {
  const base = makeShape({ x: 0, y: 0, width: 8, height: 8 })
  expect(isPointInElement(0.2, 0.2, base)).toBe(true)
  // A 45-degree rotation around the center (4, 4) swings the top-left corner
  // away from world (0, 0). Under the old top-left-pivot convention this
  // point sits right at the pivot and would stay inside for any angle.
  expect(isPointInElement(0.2, 0.2, { ...base, rotation: 45 })).toBe(false)
})
