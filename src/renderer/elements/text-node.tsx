import { useRef } from 'react'
import type Konva from 'konva'
import { Shape } from 'react-konva'
import { paintBitmapTextToContext } from '@/engine/bitmap-font'
import type { ElementChanges, TextElement } from '@/engine'
import { AUTHORING_GHOST_OPACITY } from '@/renderer/elements/authoring-constants'
import {
  commitTextTransformFromNode,
  gridPositionFromNode,
  textTransformBase,
} from '@/renderer/elements/element-transform'

function TextNode({
  element,
  cellSize,
  showAuthoring,
  onSelect,
  onChange,
  onPatch,
  registerNode,
}: {
  element: TextElement
  cellSize: number
  showAuthoring: boolean
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  onPatch: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  const transformBaseRef = useRef(textTransformBase(element))

  if (!showAuthoring) return null

  return (
    <Shape
      ref={registerNode}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
      draggable
      onClick={(e) => {
        e.cancelBubble = true
        onSelect()
      }}
      onDragStart={onSelect}
      onDragMove={(e) => {
        onPatch(gridPositionFromNode(e.target, cellSize))
      }}
      onDragEnd={(e) => {
        onChange(gridPositionFromNode(e.target, cellSize))
      }}
      onTransformStart={() => {
        transformBaseRef.current = textTransformBase(element)
      }}
      onTransformEnd={(e) => {
        onChange(commitTextTransformFromNode(e.target, cellSize, transformBaseRef.current))
      }}
      sceneFunc={(context, shape) => {
        paintBitmapTextToContext(
          context,
          element.text,
          0,
          0,
          element.fontSize,
          0,
          element.fill,
          AUTHORING_GHOST_OPACITY * (element.opacity ?? 1),
          cellSize,
        )
        context.fillStrokeShape(shape)
      }}
      hitFunc={(context, shape) => {
        context.beginPath()
        context.rect(0, 0, element.width * cellSize, element.height * cellSize)
        context.fillStrokeShape(shape)
      }}
    />
  )
}

export { TextNode }
