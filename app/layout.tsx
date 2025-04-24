import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

export const metadata = {
  title: 'Premium Auto Sales',
  description: 'Find your perfect luxury vehicle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 