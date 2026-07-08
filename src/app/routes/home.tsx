import { Button } from '@/components/ui/button'
import { EmptyProjects } from '@/components/home/empty-projects'
import { HomeHeader } from '@/components/home/home-header'
import { ProjectGrid } from '@/components/home/project-grid'
import { useProjectList } from '@/components/home/use-project-list'

function Home() {
  const { hasProjects, toggleHasProjects, projects, goToEditor } = useProjectList()

  return (
    <div className="flex h-screen w-screen flex-col gap-8 p-8">
      <Button variant="outline" className="self-start" onClick={toggleHasProjects}>
        Toggle {hasProjects ? 'empty' : 'populated'} state
      </Button>

      <HomeHeader onCreateProject={goToEditor} />

      {hasProjects ? (
        <ProjectGrid projects={projects} />
      ) : (
        <EmptyProjects onCreateProject={goToEditor} />
      )}
    </div>
  )
}

export default Home
