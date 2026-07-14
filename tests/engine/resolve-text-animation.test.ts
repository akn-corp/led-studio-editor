import { expect, test } from 'vitest'
import { applyTextAnimation } from '@/engine/animation-presets/resolve-text-animation'
import type { TextElement } from '@/engine/model/element'

function makeText(overrides: Partial<TextElement> = {}): TextElement {
  return {
    id: 'text-1',
    type: 'text',
    x: 0,
    y: 0,
    width: 5,
    height: 7,
    rotation: 0,
    opacity: 1,
    text: 'HELLO',
    fontSize: 1,
    fill: '#ffffff',
    keyframes: {},
    startTime: 0,
    duration: 4,
    hidden: false,
    backgroundColor: null,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
    ...overrides,
  }
}

test('no animation slots set leaves the element untouched', () => {
  const element = makeText()
  const resolved = applyTextAnimation(element, 1)
  expect(resolved.opacity).toBe(1)
  expect(resolved.x).toBe(0)
})

test('fade enter animation ramps opacity from 0 to full over the enter window', () => {
  const element = makeText({ enterAnimation: 'fade' })
  expect(applyTextAnimation(element, 0).opacity).toBeCloseTo(0, 5)
  expect(applyTextAnimation(element, 0.25).opacity).toBeCloseTo(0.5, 5)
  expect(applyTextAnimation(element, 0.5).opacity).toBeCloseTo(1, 5)
  expect(applyTextAnimation(element, 2).opacity).toBeCloseTo(1, 5)
})

test('fade exit animation ramps opacity back down to 0 at clip end', () => {
  const element = makeText({ exitAnimation: 'fade', duration: 4 })
  expect(applyTextAnimation(element, 3.5).opacity).toBeCloseTo(1, 5)
  expect(applyTextAnimation(element, 3.75).opacity).toBeCloseTo(0.5, 5)
  expect(applyTextAnimation(element, 4).opacity).toBeCloseTo(0, 5)
})

test('typing enter reveals the string a character at a time, exit erases it', () => {
  const element = makeText({ enterAnimation: 'typing', exitAnimation: 'typing', duration: 4 })
  expect(applyTextAnimation(element, 0).text).toBe('')
  expect(applyTextAnimation(element, 0.25).text).toBe('HEL')
  expect(applyTextAnimation(element, 0.5).text).toBe('HELLO')
  expect(applyTextAnimation(element, 4).text).toBe('')
})

test('loop animation composes continuously across the whole clip, independent of enter/exit windows', () => {
  const element = makeText({ loopAnimation: 'spin' })
  const early = applyTextAnimation(element, 0.1)
  const later = applyTextAnimation(element, 1.1)
  expect(early.rotation).not.toBe(later.rotation)
})

test('a preset not marked supportsLoop is simply inert when placed in the loop slot', () => {
  const element = makeText({ loopAnimation: 'fade' })
  const resolved = applyTextAnimation(element, 2)
  expect(resolved.opacity).toBe(1)
})

test('scale enter animation multiplies fontSize and keeps width/height in sync', () => {
  const element = makeText({ enterAnimation: 'scale', fontSize: 2, duration: 4 })
  const resolved = applyTextAnimation(element, 0.25)
  expect(resolved.fontSize).toBeCloseTo(1, 5)
  expect(resolved.width).toBeGreaterThan(0)
  expect(resolved.height).toBeGreaterThan(0)
})
