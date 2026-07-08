import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useParams } from 'react-router'

function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Editor — {projectId}</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
    </div>
  )
}

export default Editor
