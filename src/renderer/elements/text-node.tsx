import type Konva from 'konva'
import { Text } from 'react-konva'
import type { ElementChanges, TextElement } from '@/engine'
import { roundTo } from '@/lib/utils'

function TextNode({
  element,
  cellSize,
  onSelect,
  onChange,
  registerNode,
}: {
  element: TextElement
  cellSize: number
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  return (
    <Text
      ref={registerNode}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
      opacity={element.opacity}
      text={element.text}
      fontSize={element.fontSize * cellSize}
      fill={element.fill}
      draggable
      onClick={(e) => {
        e.cancelBubble = true
        onSelect()
      }}
      onDragStart={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: roundTo(e.target.x() / cellSize),
          y: roundTo(e.target.y() / cellSize),
        })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange({
          x: roundTo(node.x() / cellSize),
          y: roundTo(node.y() / cellSize),
          width: roundTo(element.width * scaleX),
          height: roundTo(element.height * scaleY),
          rotation: roundTo(node.rotation()),
          fontSize: roundTo(element.fontSize * scaleY),
        })
      }}
    />
  )
}

export { TextNode }
