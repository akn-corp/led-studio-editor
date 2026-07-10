import { ElementsSubItem } from '@/components/editor/sidebar/sub-item-renderers/elements-sub-item'
import { ShapesSubItem } from '@/components/editor/sidebar/sub-item-renderers/shapes-sub-item'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { TextSubItem } from '@/components/editor/sidebar/sub-item-renderers/text-sub-item'
import type { ComponentType } from 'react'

const subItemRenderers: Record<string, ComponentType<SubItemRendererProps>> = {
  Elements: ElementsSubItem,
  Shapes: ShapesSubItem,
  Text: TextSubItem,
}

function getSubItemRenderer(category: string): ComponentType<SubItemRendererProps> {
  return subItemRenderers[category] ?? ElementsSubItem
}

export { getSubItemRenderer }
