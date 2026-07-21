import { expect, test } from 'vitest'
import { applyShapeAnimation } from '@/engine/animation-presets/resolve-shape-animation'
import type { ShapeElement } from '@/engine/model/element'

function makeShape(overrides: Partial<ShapeElement> = {}): ShapeElement {
  return {
    id: 'shape-1',
    type: 'shape',
    shapeKind: 'square',
    x: 0,
    y: 0,
    width: 4,
    height: 4,
    rotation: 0,
    opacity: 1,
    fill: '#000000',
    keyframes: {},
    startTime: 0,
    duration: 4,
    hidden: false,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
    ...overrides,
  }
}

test('no animation slots set leaves the element untouched', () => {
  const element = makeShape()
  const resolved = applyShapeAnimation(element, 1)
  expect(resolved.opacity).toBe(1)
  expect(resolved.x).toBe(0)
  expect(resolved.rotation).toBe(0)
})

test('fade enter ramps opacity from 0 to full over the enter window', () => {
  const element = makeShape({ enterAnimation: 'fade' })
  expect(applyShapeAnimation(element, 0).opacity).toBeCloseTo(0, 5)
  expect(applyShapeAnimation(element, 0.25).opacity).toBeCloseTo(0.5, 5)
  expect(applyShapeAnimation(element, 0.5).opacity).toBeCloseTo(1, 5)
})

test('fade exit ramps opacity back down to 0 at clip end', () => {
  const element = makeShape({ exitAnimation: 'fade', duration: 4 })
  expect(applyShapeAnimation(element, 3.5).opacity).toBeCloseTo(1, 5)
  expect(applyShapeAnimation(element, 4).opacity).toBeCloseTo(0, 5)
})

test('scale enter animation grows width/height together, keeping aspect ratio', () => {
  const element = makeShape({ enterAnimation: 'scale', width: 4, height: 4, duration: 4 })
  const resolved = applyShapeAnimation(element, 0.25)
  expect(resolved.width).toBeCloseTo(2, 5)
  expect(resolved.height).toBeCloseTo(2, 5)
})

test('slideLeft/slideRight are mirror images and both fade in', () => {
  const left = applyShapeAnimation(makeShape({ enterAnimation: 'slideLeft' }), 0.25)
  const right = applyShapeAnimation(makeShape({ enterAnimation: 'slideRight' }), 0.25)
  expect(left.x).toBeGreaterThan(0)
  expect(right.x).toBeLessThan(0)
  expect(left.opacity).toBeCloseTo(right.opacity, 5)
})

test('spin loop rotates continuously and wraps at 360 degrees', () => {
  const element = makeShape({ loopAnimation: 'spin', duration: 10 })
  const early = applyShapeAnimation(element, 1)
  const later = applyShapeAnimation(element, 2)
  expect(later.rotation).toBeGreaterThan(early.rotation)
  expect(applyShapeAnimation(element, 100).rotation).toBeGreaterThanOrEqual(0)
  expect(applyShapeAnimation(element, 100).rotation).toBeLessThan(360)
})

test('pulse loop oscillates size around the base value', () => {
  const element = makeShape({ loopAnimation: 'pulse', width: 4, height: 4, duration: 10 })
  const resolved = applyShapeAnimation(element, 0.5)
  expect(resolved.width).not.toBeCloseTo(4, 5)
})

test('enter and loop compose together when both are set', () => {
  const element = makeShape({ enterAnimation: 'fade', loopAnimation: 'spin', duration: 10 })
  const resolved = applyShapeAnimation(element, 0.25)
  expect(resolved.opacity).toBeCloseTo(0.5, 5)
  expect(resolved.rotation).toBeGreaterThan(0)
})
