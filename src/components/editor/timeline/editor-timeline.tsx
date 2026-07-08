import { Maximize2, Minus, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

function EditorTimeline() {
  return (
    <div className="absolute inset-x-4 bottom-4 z-10 flex h-64 flex-col rounded-2xl border border-border/50 bg-background/70 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <Button variant="ghost" size="icon" aria-label="Play">
          <Play />
        </Button>

        <span className="text-xs text-muted-foreground">0:00.0 / 0:00.0</span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Timeline Scale</span>
          <Button variant="outline" size="icon" aria-label="Zoom out timeline">
            <Minus />
          </Button>
          <Button variant="outline" size="icon" aria-label="Zoom in timeline">
            <Plus />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 />
            Fit View
          </Button>
        </div>
      </div>

      <div className="m-4 flex flex-1 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        Timeline tracks & clips
      </div>
    </div>
  )
}

export { EditorTimeline }
