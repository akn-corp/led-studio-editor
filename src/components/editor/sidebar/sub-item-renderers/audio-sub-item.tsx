import { Music, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { useAudioUpload } from '@/components/editor/sidebar/sub-item-renderers/use-audio-upload'
import { useScene } from '@/state/use-scene'

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function AudioSubItem({ subItem }: SubItemRendererProps) {
  const { project, setAudio } = useScene()
  const { inputRef, openPicker, handleFileSelected } = useAudioUpload()
  const audio = project.audio

  return (
    <div className="col-span-3 space-y-3">
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mp3"
          className="hidden"
          onChange={(event) => void handleFileSelected(event)}
        />
        <Button variant="outline" className="w-full" onClick={openPicker}>
          <Upload />
          {subItem.label}
        </Button>
      </div>

      {audio && (
        <div className="flex items-center gap-2 rounded-xl border border-border p-3">
          <Music className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 text-xs">
            <p className="truncate font-medium">{audio.fileName}</p>
            <p className="text-muted-foreground">{formatDuration(audio.duration)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Remove audio"
            onClick={() => setAudio(null)}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  )
}

export { AudioSubItem }
