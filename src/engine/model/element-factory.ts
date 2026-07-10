import type { Environment } from '@/engine/model/environment'
import type { SquareElement, TextElement } from '@/engine/model/element'

const SQUARE_SIZE = { width: 4, height: 4 }
const TEXT_SIZE = { width: 2, height: 1 }

function createSquareElement(environment: Environment): SquareElement {
  return {
    id: crypto.randomUUID(),
    type: 'square',
    x: (environment.columns - SQUARE_SIZE.width) / 2,
    y: (environment.rows - SQUARE_SIZE.height) / 2,
    width: SQUARE_SIZE.width,
    height: SQUARE_SIZE.height,
    rotation: 0,
    opacity: 1,
    fill: '#013d9d',
  }
}

function createTextElement(environment: Environment): TextElement {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    x: (environment.columns - TEXT_SIZE.width) / 2,
    y: (environment.rows - TEXT_SIZE.height) / 2,
    width: TEXT_SIZE.width,
    height: TEXT_SIZE.height,
    rotation: 0,
    opacity: 1,
    text: 'Text',
    fontSize: 1,
    fill: '#ffffff',
  }
}

export { createSquareElement, createTextElement }
