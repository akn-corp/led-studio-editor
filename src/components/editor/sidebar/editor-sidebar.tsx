import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { sidebarItems } from '@/components/editor/sidebar/sidebar-items'
import { SidebarSubItemPanel } from '@/components/editor/sidebar/sidebar-sub-item-panel'
import { useSidebar } from '@/components/editor/sidebar/use-sidebar'

function EditorSidebar() {
  const { activeItem, toggleItem, closePanel } = useSidebar()

  return (
    <div className="pointer-events-auto flex h-full shrink-0 overflow-hidden border border-border/50 bg-background/60 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex w-14 flex-col items-center gap-2 overflow-y-auto py-4">
        {sidebarItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger
              render={
                <Button
                  variant={activeItem?.label === item.label ? 'secondary' : 'ghost'}
                  size="icon"
                  aria-label={item.label}
                  onClick={() => toggleItem(item)}
                >
                  <item.icon />
                </Button>
              }
            />
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {activeItem?.subItems && <SidebarSubItemPanel item={activeItem} onClose={closePanel} />}
    </div>
  )
}

export { EditorSidebar }
