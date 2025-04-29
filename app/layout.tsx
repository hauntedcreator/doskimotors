import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { FavoritesProvider } from '@/context/FavoritesContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Doski Motors - Premium Car Sales',
  description: 'Find your perfect luxury and performance vehicle',
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
          <Navbar />
          <main className="w-full">
            {children}
          </main>
        </FavoritesProvider>
      </body>
    </html>
  )
} 