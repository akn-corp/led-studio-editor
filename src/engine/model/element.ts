interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle'
  fill: string
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  fill: string
}

export type Element = RectangleElement | TextElement
