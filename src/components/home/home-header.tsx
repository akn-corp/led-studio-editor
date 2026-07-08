import { CirclePlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function HomeHeader({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Projects</h1>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects" className="w-56 pl-9" />
        </div>
        <Button onClick={onCreateProject} aria-label="Create new project">
          <CirclePlus />
          New Project
        </Button>
      </div>
    </div>
  )
}

export { HomeHeader }
