import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InzuFinder – Trusted House Rentals in Kigali',
  description: 'Find verified rentals in Kigali, Rwanda.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
