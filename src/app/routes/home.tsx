import { Button } from '@/components/ui/button'
import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Hello World</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
    </div>
  )
}

export default Home
