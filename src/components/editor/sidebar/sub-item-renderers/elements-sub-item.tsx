import { Button } from '@/components/ui/button'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { useSubItemDrag } from '@/components/editor/sidebar/sub-item-renderers/use-sub-item-drag'

function ElementsSubItem({ subItem }: SubItemRendererProps) {
  const { ref, isDraggable, isDragging } = useSubItemDrag(subItem)
  const Icon = subItem.icon

  return (
    <Button
      ref={ref}
      variant="outline"
      className="flex h-16 w-full flex-col"
      disabled={!isDraggable}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {Icon && <Icon />}
      {subItem.label}
    </Button>
  )
}

export { ElementsSubItem }
