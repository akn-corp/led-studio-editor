import { useState } from 'react'
import { sidebarItems, type SidebarItem } from '@/components/editor/sidebar/sidebar-items'

function useSidebar() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  const activeItem = sidebarItems.find((item) => item.label === activeLabel) ?? null

  const toggleItem = (item: SidebarItem) => {
    if (!item.subItems) return
    setActiveLabel((current) => (current === item.label ? null : item.label))
  }

  const closePanel = () => setActiveLabel(null)

  return { activeItem, toggleItem, closePanel }
}

export { useSidebar }
