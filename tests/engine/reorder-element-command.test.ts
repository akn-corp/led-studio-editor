import { expect, test } from 'vitest'
import { ReorderElementCommand } from '@/engine/commands/reorder-element-command'
import type { ShapeElement } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

function makeShape(id: string): ShapeElement {
  return {
    id,
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
    duration: 10,
    hidden: false,
    animationSpeed: 1,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
  }
}

function makeProject(ids: string[]): Project {
  return {
    id: 'p',
    name: 'p',
    environment: { rows: 16, columns: 16, isSetted: true },
    elements: ids.map(makeShape),
    audio: null,
    videoAssets: [],
  }
}

test('moves the element to occupy the target element position', () => {
  const project = makeProject(['a', 'b', 'c', 'd'])
  const result = new ReorderElementCommand('a', 'c').execute(project)
  expect(result.elements.map((e) => e.id)).toEqual(['b', 'c', 'a', 'd'])
})

test('moving downward and upward both land on the target slot', () => {
  const project = makeProject(['a', 'b', 'c', 'd'])
  expect(new ReorderElementCommand('d', 'b').execute(project).elements.map((e) => e.id)).toEqual([
    'a',
    'd',
    'b',
    'c',
  ])
})

test('a no-op when the ids match or either id is missing', () => {
  const project = makeProject(['a', 'b', 'c'])
  expect(new ReorderElementCommand('a', 'a').execute(project)).toBe(project)
  expect(new ReorderElementCommand('a', 'missing').execute(project)).toBe(project)
  expect(new ReorderElementCommand('missing', 'a').execute(project)).toBe(project)
})

test('undo restores the original order', () => {
  const project = makeProject(['a', 'b', 'c', 'd'])
  const command = new ReorderElementCommand('a', 'c')
  const moved = command.execute(project)
  const restored = command.undo(moved)
  expect(restored.elements.map((e) => e.id)).toEqual(['a', 'b', 'c', 'd'])
})
