import type Konva from 'konva'
import type { Element, ElementChanges } from '@/engine'
import { SquareNode } from '@/renderer/elements/square-node'
import { TextNode } from '@/renderer/elements/text-node'

interface ElementNodeProps {
  element: Element
  cellSize: number
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}

function ElementNode({ element, cellSize, onSelect, onChange, registerNode }: ElementNodeProps) {
  switch (element.type) {
    case 'square':
      return (
        <SquareNode
          element={element}
          cellSize={cellSize}
          onSelect={onSelect}
          onChange={onChange}
          registerNode={registerNode}
        />
      )
    case 'text':
      return (
        <TextNode
          element={element}
          cellSize={cellSize}
          onSelect={onSelect}
          onChange={onChange}
          registerNode={registerNode}
        />
      )
    default: {
      const exhaustiveCheck: never = element
      return exhaustiveCheck
    }
  }
}

export { ElementNode }
