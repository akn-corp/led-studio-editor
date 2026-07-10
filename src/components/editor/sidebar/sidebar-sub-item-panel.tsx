import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SidebarItem } from '@/components/editor/sidebar/sidebar-items'
import { getSubItemRenderer } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-registry'

function SidebarSubItemPanel({ item, onClose }: { item: SidebarItem; onClose: () => void }) {
  const SubItemRenderer = getSubItemRenderer(item.label)

  return (
    <div className="flex w-72 flex-col gap-3 border-l border-border/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{item.label}</h2>
        <Button variant="ghost" size="icon-xs" aria-label="Close" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {item.subItems?.map((subItem) => (
          <SubItemRenderer key={subItem.label} subItem={subItem} />
        ))}
      </div>
    </div>
  )
}

export { SidebarSubItemPanel }
