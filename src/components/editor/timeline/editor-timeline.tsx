import { useState } from 'react'
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  RepeatOff,
  SquareSplitHorizontal,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { AudioTrackRow } from '@/components/editor/timeline/audio-track-row'
import { ElementTrackRow } from '@/components/editor/timeline/element-track-row'
import { TimelinePlayhead } from '@/components/editor/timeline/timeline-playhead'
import { TimelineRuler } from '@/components/editor/timeline/timeline-ruler'
import {
  DEFAULT_PIXELS_PER_SECOND,
  MAX_PIXELS_PER_SECOND,
  MIN_PIXELS_PER_SECOND,
  trackWidthFor,
} from '@/components/editor/timeline/timeline-scale'
import { useTimelineClock } from '@/hooks/use-timeline-clock'
import { formatTime } from '@/lib/utils'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'

function EditorTimeline() {
  const { project } = useScene()
  const { currentTime, isPlaying, isLoop, duration, toggle, setLoop, seek } = usePlayback()
  const [isExpanded, setIsExpanded] = useState(true)
  const [zoom, setZoom] = useState(
    ((DEFAULT_PIXELS_PER_SECOND - MIN_PIXELS_PER_SECOND) /
      (MAX_PIXELS_PER_SECOND - MIN_PIXELS_PER_SECOND)) *
      100,
  )

  useTimelineClock()

  const pixelsPerSecond =
    MIN_PIXELS_PER_SECOND + (zoom / 100) * (MAX_PIXELS_PER_SECOND - MIN_PIXELS_PER_SECOND)
  const trackWidth = trackWidthFor(duration, pixelsPerSecond)

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-52 flex-col rounded-2xl border border-border/50 bg-background/60 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 [&>div]:flex [&>div]:items-center [&>div]:gap-3">
        <Button variant="outline" size="sm">
          <SquareSplitHorizontal />
          Split Clip
        </Button>

        <div>
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={toggle}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Loop"
            onClick={() => setLoop(!isLoop)}
          >
            {isLoop ? <RepeatOff /> : <Repeat />}
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Zoom out timeline">
              <ZoomOut />
            </Button>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(Array.isArray(value) ? value[0] : value)}
              max={100}
              step={1}
              className="data-horizontal:w-24"
            />
            <Button variant="ghost" size="icon-sm" aria-label="Zoom in timeline">
              <ZoomIn />
            </Button>
          </div>

          <Button variant="ghost" size="icon-sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-1 overflow-x-auto">
          <div className="relative flex min-w-full flex-col" style={{ width: trackWidth }}>
            <TimelineRuler duration={duration} pixelsPerSecond={pixelsPerSecond} onSeek={seek} />
            <AudioTrackRow duration={duration} pixelsPerSecond={pixelsPerSecond} />
            {project.elements.map((element) => (
              <ElementTrackRow
                key={element.id}
                element={element}
                duration={duration}
                pixelsPerSecond={pixelsPerSecond}
              />
            ))}
            <TimelinePlayhead
              currentTime={currentTime}
              pixelsPerSecond={pixelsPerSecond}
              onSeek={seek}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { EditorTimeline }
