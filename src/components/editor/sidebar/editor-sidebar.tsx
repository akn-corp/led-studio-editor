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
    <div className="absolute top-10 bottom-0 left-0 z-10 flex w-20 flex-col items-center gap-2 overflow-y-auto border border-border/50 bg-background/60 py-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
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
