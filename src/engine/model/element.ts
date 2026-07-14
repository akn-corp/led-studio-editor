import type { KeyframeTracks } from '@/engine/model/keyframe'

interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  keyframes: KeyframeTracks
}

export interface SquareElement extends BaseElement {
  type: 'square'
  fill: string
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  fill: string
}

export type Element = SquareElement | TextElement

export type ElementChanges = Partial<Omit<SquareElement, 'id' | 'type'>> &
  Partial<Omit<TextElement, 'id' | 'type'>>
