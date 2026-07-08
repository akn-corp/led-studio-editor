import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import { Link } from 'react-router'

function NotFound() {
  return (
    <div className="text-center flex flex-col gap-5 items-center justify-center h-screen flex-1">
      <div>
        <h1 className="text-7xl font-bold [-webkit-text-stroke:1px_#644A40] dark:[-webkit-text-stroke:1px_#ffdfb5] text-transparent dark:text-secondary opacity-70">
          404
        </h1>
        <p className="text-sm text-muted-foreground">The requested page could not be found.</p>
      </div>
      <Button variant="outline">
        <Link to="/">Go back to home</Link>
        <MoveRight />
      </Button>
    </div>
  )
}

export default NotFound
