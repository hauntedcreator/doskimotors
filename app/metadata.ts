import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Doski Motors',
  description: 'Premier automotive dealer specializing in luxury and performance vehicles',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3a8a',
} 