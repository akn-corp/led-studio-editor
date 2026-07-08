import { useState } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '@/config/paths'

const STATIC_PROJECT_ID = 'demo-project'

export interface Project {
  id: string
  title: string
}

const placeholderProjects: Project[] = [
  { id: '1', title: 'Project title' },
  { id: '2', title: 'Project title' },
  { id: '3', title: 'Project title' },
  { id: '4', title: 'Project title' },
]

function useProjectList() {
  const navigate = useNavigate()
  const [hasProjects, setHasProjects] = useState(false)

  const toggleHasProjects = () => setHasProjects((value) => !value)
  const goToEditor = () => navigate(paths.editor.getHref(STATIC_PROJECT_ID))

  return {
    hasProjects,
    toggleHasProjects,
    projects: placeholderProjects,
    goToEditor,
  }
}

export { useProjectList }
