import { useMemo } from 'react'
import { formatTime } from '@/lib/utils'
import {
  LABEL_WIDTH,
  offsetToTime,
  timeToOffset,
  trackWidthFor,
} from '@/components/editor/timeline/timeline-scale'

function tickIntervalFor(pixelsPerSecond: number) {
  if (pixelsPerSecond < 15) return 5
  if (pixelsPerSecond < 40) return 2
  return 1
}

function TimelineRuler({
  duration,
  pixelsPerSecond,
  onSeek,
}: {
  duration: number
  pixelsPerSecond: number
  onSeek: (time: number) => void
}) {
  const trackWidth = trackWidthFor(duration, pixelsPerSecond)
  const interval = tickIntervalFor(pixelsPerSecond)

  const ticks = useMemo(() => {
    const values: number[] = []
    for (let t = 0; t <= duration; t += interval) values.push(t)
    return values
  }, [duration, interval])

  return (
    <div
      className="relative h-6 shrink-0 cursor-pointer border-b border-border/50"
      style={{ width: trackWidth }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onSeek(offsetToTime(e.clientX - rect.left, pixelsPerSecond))
      }}
    >
      <div style={{ width: LABEL_WIDTH }} className="absolute inset-y-0 left-0" />
      {ticks.map((t) => (
        <div
          key={t}
          className="absolute top-0 h-full border-l border-border/40 pl-1 text-[10px] text-muted-foreground"
          style={{ left: timeToOffset(t, pixelsPerSecond) }}
        >
          {formatTime(t)}
        </div>
      ))}
    </div>
  )
}

export { TimelineRuler }
