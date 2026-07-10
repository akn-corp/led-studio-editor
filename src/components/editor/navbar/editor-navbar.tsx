import { useNavigate } from 'react-router'
import { UndoRedoControl } from '@/components/editor/navbar/undo-redo-control'
import { ZoomControl } from '@/components/editor/navbar/zoom-control'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { ChevronLeft, Play, Save, Square } from 'lucide-react'
import { usePreview } from '@/hooks/use-preview'

function EditorNavbar({ projectId }: { projectId?: string }) {
  const navigate = useNavigate()
  const { isRunning, toggle, available } = usePreview()

  return (
    <div className="absolute inset-x-0 top-0 z-20 grid grid-cols-3 h-12 border-b border-border/50 bg-background/60 px-3 shadow-lg ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150 dark:ring-foreground/10">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(paths.home.getHref())}>
          <ChevronLeft />
          Back
        </Button>
        <UndoRedoControl />
      </div>

      <div className="text-xs flex items-center justify-center">
        <h4>{projectId ?? 'Untitled Project'}</h4>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <ZoomControl />
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
