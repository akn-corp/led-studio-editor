import type Konva from 'konva'
import type { Element, ElementChanges } from '@/engine'
import { SquareNode } from '@/renderer/elements/square-node'
import { TextNode } from '@/renderer/elements/text-node'
import { VideoNode } from '@/renderer/elements/video-node'

interface ElementNodeProps {
  element: Element
  cellSize: number
  showAuthoring: boolean
  onSelect: () => void
  onChange: (changes: ElementChanges) => void
  onPatch: (changes: ElementChanges) => void
  registerNode: (node: Konva.Node | null) => void
}

function ElementNode({
  element,
  cellSize,
  showAuthoring,
  onSelect,
  onChange,
  onPatch,
  registerNode,
}: ElementNodeProps) {
  switch (element.type) {
    case 'square':
      return (
        <SquareNode
          element={element}
          cellSize={cellSize}
          showAuthoring={showAuthoring}
          onSelect={onSelect}
          onChange={onChange}
          onPatch={onPatch}
          registerNode={registerNode}
        />
      )
    case 'text':
      return (
        <TextNode
          element={element}
          cellSize={cellSize}
          showAuthoring={showAuthoring}
          onSelect={onSelect}
          onChange={onChange}
          onPatch={onPatch}
          registerNode={registerNode}
        />
      )
    case 'video':
      return (
        <VideoNode
          element={element}
          cellSize={cellSize}
          showAuthoring={showAuthoring}
          onSelect={onSelect}
          onChange={onChange}
          onPatch={onPatch}
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
