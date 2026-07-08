import { TooltipProvider } from '@/components/ui/tooltip'
import React from 'react'

function AppProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}

export { AppProvider }
