import { Button } from '@/components/ui/button'
import { Component, Music, Shapes, Sticker, TvMinimalPlay, Type } from 'lucide-react'

const sidebarItems = [
  { label: 'Elements', icon: Component },
  { label: 'Text', icon: Type },
  { label: 'Videos', icon: TvMinimalPlay },
  { label: 'Audio', icon: Music },
  { label: 'Shapes', icon: Shapes },
  { label: 'Stickers', icon: Sticker },
]

function EditorSidebar() {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2 border-r border-border bg-background pt-18 pb-4">
      {sidebarItems.map(({ label, icon: Icon }) => (
        <Button key={label} variant="ghost" className="h-auto w-16 flex-col gap-1 py-2">
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  )
}

export { EditorSidebar }
