import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioWaveform } from '@/hooks/use-audio-waveform'
import { useScene } from '@/state/use-scene'
import { TimelineLaneRow } from '@/components/editor/timeline/timeline-lane-row'
import { trackWidthFor } from '@/components/editor/timeline/timeline-scale'

// Waveform + play/pause, synced to the shared timeline clock (usePlayback,
// via useAudioPlayback) and scaled to line up with the ruler/keyframe rows.
function AudioTrackRow({
  duration,
  pixelsPerSecond,
}: {
  duration: number
  pixelsPerSecond: number
}) {
  const { project } = useScene()
  const audio = project.audio
  const { peaks, isLoading } = useAudioWaveform(audio?.filePath ?? null)
  const { isPlaying, toggle } = useAudioPlayback(audio?.filePath ?? null)

  if (!audio) return null

  const waveformWidth = (audio.duration || duration) * pixelsPerSecond

  return (
    <TimelineLaneRow
      laneClassName="bg-amber-500"
      trackWidth={trackWidthFor(duration, pixelsPerSecond)}
      onLabelClick={toggle}
      label={
        <>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
            onClick={(e) => {
              e.stopPropagation()
              toggle()
            }}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <span className="truncate">{audio.fileName}</span>
        </>
      }
    >
      <div className="flex h-full items-center gap-px" style={{ width: waveformWidth }}>
        {isLoading || !peaks ? (
          <span className="text-xs text-muted-foreground">Decoding…</span>
        ) : (
          peaks.map((peak, index) => (
            <div
              key={index}
              className="w-1 flex-1 rounded-full bg-white/50"
              style={{ height: `${Math.max(peak * 100, 4)}%` }}
            />
          ))
        )}
      </div>
    </TimelineLaneRow>
  )
}

export { AudioTrackRow }
