import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { PageTransition } from '@/components/PageTransition'
import DemoBanner from '@/components/DemoBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'InzuFinder – Trusted House Rentals in Kigali, Rwanda',
  description: 'Find verified, trusted rental homes in Kigali. Browse apartments, houses, and studios with confidence. No fake listings – every property is admin-approved.',
  keywords: 'house rental Kigali, Rwanda rental, apartments Kigali, trusted rentals, InzuFinder',
  openGraph: {
    title: 'InzuFinder – Trusted House Rentals in Kigali',
    description: 'Browse verified rental listings in Kigali, Rwanda.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-warm-white text-gray-900">
        <DemoBanner />
        <PageTransition>{children}</PageTransition>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
