import { Card } from '@/components/ui/card'
import type { Project } from '@/components/home/use-project-list'

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col gap-2">
          <Card className="aspect-video" />
          <span className="text-sm text-muted-foreground">{project.title}</span>
        </div>
      ))}
    </div>
  )
}

export { ProjectGrid }
