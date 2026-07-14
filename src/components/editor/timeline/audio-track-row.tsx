import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioWaveform } from '@/hooks/use-audio-waveform'
import { useScene } from '@/state/use-scene'

// Waveform + a standalone play/pause preview — not synced to any playhead,
// since there's no currentTime clock yet for it to sync against (that
// lands with the timeline/keyframes phase). This is "can I hear what I
// attached," not "does it play alongside the animation."
function AudioTrackRow() {
  const { project } = useScene()
  const audio = project.audio
  const { peaks, isLoading } = useAudioWaveform(audio?.filePath ?? null)
  const { isPlaying, toggle } = useAudioPlayback(audio?.filePath ?? null)

  if (!audio) return null

  return (
    <div className="mx-4 mt-3 flex h-12 shrink-0 items-center gap-2 rounded-lg border border-border/50 bg-amber-500/10 px-2">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
        onClick={toggle}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <span className="max-w-24 shrink-0 truncate text-xs text-muted-foreground">
        {audio.fileName}
      </span>
      <div className="flex h-full flex-1 items-center gap-px">
        {isLoading || !peaks ? (
          <span className="text-xs text-muted-foreground">Decoding…</span>
        ) : (
          peaks.map((peak, index) => (
            <div
              key={index}
              className="min-w-px flex-1 rounded-full bg-amber-500/70"
              style={{ height: `${Math.max(peak * 100, 4)}%` }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export { AudioTrackRow }
