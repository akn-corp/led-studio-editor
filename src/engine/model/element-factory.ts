import type { Environment } from '@/engine/model/environment'
import type { SquareElement, TextElement } from '@/engine/model/element'
import { measureBitmapText } from '@/engine/bitmap-font'

const SQUARE_SIZE = { width: 4, height: 4 }
const DEFAULT_TEXT = 'HELLO'
const DEFAULT_FONT_SIZE = 1

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
    keyframes: {},
  }
}

function createTextElement(environment: Environment): TextElement {
  const { width, height } = measureBitmapText(DEFAULT_TEXT, DEFAULT_FONT_SIZE)
  return {
    id: crypto.randomUUID(),
    type: 'text',
    x: (environment.columns - width) / 2,
    y: (environment.rows - height) / 2,
    width,
    height,
    rotation: 0,
    opacity: 1,
    text: DEFAULT_TEXT,
    fontSize: DEFAULT_FONT_SIZE,
    fill: '#ffffff',
    keyframes: {},
  }
}

export { createSquareElement, createTextElement }
