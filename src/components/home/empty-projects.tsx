import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

function EmptyProjects({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <Empty className="flex-1 border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>No Projects found</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet.
          <br />
          Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={onCreateProject}>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
    </Empty>
  )
}

export { EmptyProjects }
