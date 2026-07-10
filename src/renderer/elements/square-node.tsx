import type Konva from 'konva'
import { Rect } from 'react-konva'
import type { ElementChanges, SquareElement } from '@/engine'
import { roundTo } from '@/lib/utils'

// The LED wall has no solid surface — only individual LEDs lighting up
// (see ARCHITECTURE.md, "Handoff to the routing tool"). The square itself
// is just a faint authoring guide for select/drag/resize; the actual color
// is carried by the LED dots it covers, drawn by EnvironmentGrid.
const GHOST_OPACITY = 0.2

function SquareNode({
  element,
  cellSize,
  onSelect,
  onChange,
  registerNode,
}: {
  element: SquareElement
  cellSize: number
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  return (
    <Rect
      ref={registerNode}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
      opacity={GHOST_OPACITY}
      fill={element.fill}
      stroke={element.fill}
      strokeWidth={1}
      dash={[4, 4]}
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
        })
      }}
    />
  )
}

export { SquareNode }
