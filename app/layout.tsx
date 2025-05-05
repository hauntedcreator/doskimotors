import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './mobile.css'
import Navbar from '@/components/Navbar'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import MobileDetector from '@/components/MobileDetector'

const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preload" href="/images/Logos/white.svg" as="image" fetchPriority="high" />
        <link rel="preload" href="/images/Logos/black.svg" as="image" fetchPriority="high" />
        <link rel="stylesheet" href="/app/mobile.css" media="(max-width: 767px)" />
        
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        <style dangerouslySetInnerHTML={{ __html: `
          @media screen and (min-width: 1024px) {
            .preload-fix {
              content-visibility: auto;
              contain-intrinsic-size: 0 500px;
            }
          }
          
          @media screen and (max-width: 767px) {
            main {
              padding-top: 64px;
            }
            body {
              -webkit-text-size-adjust: 100%;
            }
          }
        `}} />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
        <MobileDetector />
        <Toaster position="bottom-right" />
        <Providers>
          <FavoritesProvider>
            <Navbar />
            <main className="w-full">
              {children}
            </main>
          </FavoritesProvider>
        </Providers>
      </body>
    </html>
  )
} 