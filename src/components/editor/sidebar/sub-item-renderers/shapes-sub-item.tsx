import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { useSubItemDrag } from '@/components/editor/sidebar/sub-item-renderers/use-sub-item-drag'

function ShapesSubItem({ subItem }: SubItemRendererProps) {
  const { ref, isDraggable, isDragging } = useSubItemDrag(subItem)
  const Icon = subItem.icon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            ref={ref}
            variant="outline"
            size="icon"
            className="size-14"
            disabled={!isDraggable}
            style={{ opacity: isDragging ? 0.5 : 1 }}
          >
            {Icon ? <Icon className="size-6" /> : <div className="size-8 rounded-sm border border-foreground" />}
          </Button>
        }
      />
      <TooltipContent side="right">{subItem.label}</TooltipContent>
    </Tooltip>
  )
}

export { ShapesSubItem }
