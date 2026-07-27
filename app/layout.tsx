import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Bio-Litera | Konservasi Mangrove & SDGs',
  description:
    'Platform pembelajaran literasi sains tentang ekosistem mangrove, konservasi, dan Tujuan Pembangunan Berkelanjutan (SDGs).',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1f6e4d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`light ${inter.variable} ${poppins.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
