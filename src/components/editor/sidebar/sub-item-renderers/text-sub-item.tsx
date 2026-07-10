import { Button } from '@/components/ui/button'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { useSubItemDrag } from '@/components/editor/sidebar/sub-item-renderers/use-sub-item-drag'

function TextSubItem({ subItem }: SubItemRendererProps) {
  const { ref, isDraggable, isDragging } = useSubItemDrag(subItem)

  return (
    <Button
      ref={ref}
      variant="outline"
      className="h-auto w-full flex-col items-start gap-1 p-3"
      disabled={!isDraggable}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="text-lg font-semibold">Aa</span>
      <span className="text-xs text-muted-foreground">{subItem.label}</span>
    </Button>
  )
}

export { TextSubItem }
