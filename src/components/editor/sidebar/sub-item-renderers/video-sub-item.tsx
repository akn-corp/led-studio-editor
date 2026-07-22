import { Trash2, Upload, Video as VideoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SubItemRendererProps } from '@/components/editor/sidebar/sub-item-renderers/sub-item-renderer-props'
import { useSubItemDrag } from '@/components/editor/sidebar/sub-item-renderers/use-sub-item-drag'
import { useVideoUpload } from '@/components/editor/sidebar/sub-item-renderers/use-video-upload'
import type { SidebarSubItem } from '@/components/editor/sidebar/sidebar-items'
import { createVideoElement, type VideoAsset } from '@/engine'
import { useScene } from '@/state/use-scene'

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024)
  return `${megabytes.toFixed(1)} MB`
}

function VideoSubItem({ subItem }: SubItemRendererProps) {
  const { project, removeVideoAsset } = useScene()
  const { inputRef, openPicker, handleFilesSelected } = useVideoUpload()

  return (
    <div className="col-span-3">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(event) => void handleFilesSelected(event)}
      />

      <Tabs defaultValue="library">
        <TabsList className="w-full">
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="pt-3">
          <p className="text-center text-xs text-muted-foreground">No stock videos available.</p>
        </TabsContent>

        <TabsContent value="library" className="flex flex-col gap-3 pt-3">
          <Button variant="outline" className="w-full" onClick={openPicker}>
            <Upload />
            {subItem.label}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            {project.videoAssets.map((asset) => (
              <VideoAssetCard
                key={asset.id}
                asset={asset}
                onRemove={() => removeVideoAsset(asset.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VideoAssetCard({ asset, onRemove }: { asset: VideoAsset; onRemove: () => void }) {
  const dragSubItem: SidebarSubItem = {
    label: asset.id,
    create: (environment, startTime) => createVideoElement(environment, startTime ?? 0, asset),
  }
  const { ref, isDraggable, isDragging } = useSubItemDrag(dragSubItem)

  return (
    <div
      ref={ref}
      className="group relative flex cursor-grab flex-col overflow-hidden rounded-lg border border-border/50"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: isDraggable ? 'grab' : undefined }}
    >
      <div className="relative aspect-video w-full bg-muted">
        {asset.thumbnailDataUrl ? (
          <img src={asset.thumbnailDataUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <VideoIcon className="size-5 text-muted-foreground" />
          </div>
        )}
        <span className="absolute right-1 bottom-1 rounded bg-black/70 px-1 text-[10px] text-white">
          {formatDuration(asset.duration)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Remove video"
          className="absolute top-1 right-1 bg-black/50 opacity-0 hover:bg-black/70 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 className="text-white" />
        </Button>
      </div>
      <div className="p-1.5 text-left text-[10px]">
        <p className="truncate font-medium">{asset.fileName}</p>
        <p className="text-muted-foreground">{formatFileSize(asset.sizeBytes)}</p>
      </div>
    </div>
  )
}

export { VideoSubItem }
