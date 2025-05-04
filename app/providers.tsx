'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EnhancedClientWrapper from './EnhancedClientWrapper'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <EnhancedClientWrapper>
      <QueryClientProvider client={queryClient}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </QueryClientProvider>
    </EnhancedClientWrapper>
  )
} 