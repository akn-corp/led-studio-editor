import { useDraggable } from '@dnd-kit/react'
import type { SidebarSubItem } from '@/components/editor/sidebar/sidebar-items'

// @dnd-kit/react's useDraggable wires up the drag interaction entirely
// through the returned `ref` — unlike @dnd-kit/core, there's no
// listeners/attributes to spread and no transform to apply by hand.
function useSubItemDrag(subItem: SidebarSubItem) {
  const isDraggable = Boolean(subItem.create) || Boolean(subItem.isEnvironment)

  const { ref, isDragging } = useDraggable({
    id: `sidebar-sub-item-${subItem.label}`,
    data: { subItem },
    disabled: !isDraggable,
  })

  return { ref, isDraggable, isDragging }
}

export { useSubItemDrag }
