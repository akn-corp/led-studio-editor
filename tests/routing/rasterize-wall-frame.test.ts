import { expect, test } from 'vitest'
import { rasterizeWallFrame } from '../../src/routing/rasterize-wall-frame.ts'
import { entityIdForCell } from '../../src/routing/wall-mapping.ts'
import type { Project } from '../../src/engine/model/project.ts'
import type { SquareElement } from '../../src/engine/model/element.ts'

function makeProject(element: SquareElement): Project {
  return {
    id: 'p',
    name: 'p',
    environment: { rows: 128, columns: 128, isSetted: true },
    elements: [element],
    audio: null,
    videoAssets: [],
  }
}

function makeSquare(overrides: Partial<SquareElement> = {}): SquareElement {
  return {
    id: 'square-1',
    type: 'square',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    rotation: 0,
    opacity: 1,
    fill: '#ff0000',
    keyframes: {},
    startTime: 0,
    duration: 10,
    hidden: false,
    ...overrides,
  }
}

// Regression test: a physical-wall preview stream that ignores the playhead
// would send the exact same frame every tick regardless of keyframed
// animation — this is what actually shipped as a bug (see conversation).
test('rasterizeWallFrame resolves keyframed properties at the given time, not just the base value', () => {
  const element = makeSquare({
    keyframes: { opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 1, value: 1, easing: 'linear' }] },
  })
  const project = makeProject(element)
  const entityId = entityIdForCell(0, 0)!

  const atStart = rasterizeWallFrame(project, 0).find((entry) => entry.entityId === entityId)!
  const atEnd = rasterizeWallFrame(project, 1).find((entry) => entry.entityId === entityId)!

  expect(atStart.r).toBe(0)
  expect(atEnd.r).toBe(255)
})

test('rasterizeWallFrame excludes a clip outside its time range even if it would otherwise cover the cell', () => {
  const element = makeSquare({ startTime: 5, duration: 2 })
  const project = makeProject(element)
  const entityId = entityIdForCell(0, 0)!

  const before = rasterizeWallFrame(project, 0).find((entry) => entry.entityId === entityId)!
  const during = rasterizeWallFrame(project, 6).find((entry) => entry.entityId === entityId)!

  expect(before.r).toBe(0)
  expect(during.r).toBe(255)
})
