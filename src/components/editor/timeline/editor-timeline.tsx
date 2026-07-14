import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { AudioTrackRow } from '@/components/editor/timeline/audio-track-row'
import {
  Maximize2,
  Minimize2,
  Play,
  Repeat,
  RepeatOff,
  SquareSplitHorizontal,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useState } from 'react'

function EditorTimeline() {
  const [isLoop, setIsLoop] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  function toggleLoop() {
    setIsLoop(!isLoop)
  }

  function toggleExpansion() {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-52 flex-col rounded-2xl border border-border/50 bg-background/60 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 [&>div]:flex [&>div]:items-center [&>div]:gap-3">
        <Button variant="outline" size="sm">
          <SquareSplitHorizontal />
          Split Clip
        </Button>

        <div>
          <span className="text-xs text-muted-foreground">0:00.0 / 0:00.0</span>
          <Button variant="ghost" size="icon-sm" aria-label="Play">
            <Play />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Loop" onClick={toggleLoop}>
            {isLoop ? <RepeatOff /> : <Repeat />}
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Play">
              <ZoomOut />
            </Button>
            <Slider defaultValue={[75]} max={100} step={1} className="data-horizontal:w-24" />
            <Button variant="ghost" size="icon-sm" aria-label="Play">
              <ZoomIn />
            </Button>
          </div>

          <Button variant="ghost" size="icon-sm" onClick={toggleExpansion}>
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <AudioTrackRow />
        <div className="m-4 flex flex-1 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
          Timeline tracks & clips
        </div>
      </div>
    </div>
  )
}

export { EditorTimeline }
