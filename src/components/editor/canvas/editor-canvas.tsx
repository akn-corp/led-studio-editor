import { useState } from 'react'
import { EnvironmentControls } from '@/components/editor/canvas/environment-controls'
import { EnvironmentGrid } from '@/renderer/environment/environment-grid'

function EditorCanvas() {
  const [isEnvironmentPanelOpen, setIsEnvironmentPanelOpen] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted/30">
      <EnvironmentGrid
        isSelected={isEnvironmentPanelOpen}
        onWallClick={() => setIsEnvironmentPanelOpen((open) => !open)}
      />
      {isEnvironmentPanelOpen && <EnvironmentControls />}
    </div>
  )
}

export { EditorCanvas }
