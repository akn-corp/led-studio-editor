import { useRef } from 'react'
import type Konva from 'konva'
import { Rect } from 'react-konva'
import type { ElementChanges, SquareElement } from '@/engine'
import { AUTHORING_GHOST_OPACITY } from '@/renderer/elements/authoring-constants'
import {
  commitTransformFromNode,
  gridPositionFromNode,
} from '@/renderer/elements/element-transform'

function SquareNode({
  element,
  cellSize,
  showAuthoring,
  onSelect,
  onChange,
  onPatch,
  registerNode,
}: {
  element: SquareElement
  cellSize: number
  showAuthoring: boolean
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  onPatch: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}) {
  const transformBaseRef = useRef({ width: element.width, height: element.height })

  if (!showAuthoring) return null

  return (
    <Rect
      ref={registerNode}
      x={element.x * cellSize}
      y={element.y * cellSize}
      width={element.width * cellSize}
      height={element.height * cellSize}
      rotation={element.rotation}
      opacity={AUTHORING_GHOST_OPACITY}
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
      onDragMove={(e) => {
        onPatch(gridPositionFromNode(e.target, cellSize))
      }}
      onDragEnd={(e) => {
        onChange(gridPositionFromNode(e.target, cellSize))
      }}
      onTransformStart={() => {
        transformBaseRef.current = { width: element.width, height: element.height }
      }}
      onTransformEnd={(e) => {
        onChange(commitTransformFromNode(e.target, cellSize, transformBaseRef.current))
      }}
    />
  )
}

export { SquareNode }
