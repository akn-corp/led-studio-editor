import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { HubSettingsDialog } from '@/components/editor/settings/hub-settings-dialog'
import { UndoRedoControl } from '@/components/editor/navbar/undo-redo-control'
import { ZoomControl } from '@/components/editor/navbar/zoom-control'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { applyWallMapping } from '@/engine/apply-wall-mapping'
import { parseWallBandsJson } from '@/engine/hub-config-client'
import { usePreview } from '@/hooks/use-preview'
import { readCachedWallBandsJson } from '@/state/use-hub-settings'
import { ChevronLeft, Play, Save, Square } from 'lucide-react'

function EditorNavbar({ projectId }: { projectId?: string }) {
  const navigate = useNavigate()
  const { isRunning, toggle, available, status } = usePreview()

  useEffect(() => {
    const cached = readCachedWallBandsJson()
    if (!cached) return
    try {
      void applyWallMapping(parseWallBandsJson(cached))
    } catch {
      /* ignore corrupt cache */
    }
  }, [])

  return (
    <div className="absolute inset-x-0 top-0 z-20 grid grid-cols-3 h-12 border-b border-border/50 bg-background/60 px-3 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(paths.home.getHref())}>
          <ChevronLeft />
          Back
        </Button>
        <UndoRedoControl />
      </div>

      <div className="text-xs flex flex-col items-center justify-center gap-0.5">
        <h4>{projectId ?? 'Untitled Project'}</h4>
        {status ? <span className="text-[10px] text-muted-foreground truncate max-w-[240px]">{status}</span> : null}
      </div>

      <div className="flex items-center gap-2 justify-end">
        <ZoomControl />
        <HubSettingsDialog />
        <Button
          variant={isRunning ? 'default' : 'outline'}
          onClick={() => void toggle()}
          disabled={!available}
          title={available ? undefined : 'Preview UDP disponible uniquement dans Electron'}
        >
          {isRunning ? <Square /> : <Play />}
          {isRunning ? 'Stop' : 'Preview'}
        </Button>
        <Button variant="outline">
          <Save />
          Save
        </Button>
        <Button>Export</Button>
      </div>
    </div>
  )
}

export { EditorNavbar }
