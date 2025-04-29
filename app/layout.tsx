import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import Layout from '@/components/layout/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeslaRent - Premium Tesla Rentals',
  description: 'Experience luxury electric driving with our premium Tesla rental service.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
        <FavoritesProvider>
          <Layout>
            {children}
          </Layout>
        </FavoritesProvider>
      </body>
    </html>
  )
} 