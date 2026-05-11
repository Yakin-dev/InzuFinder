import type { Metadata } from 'next'

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
  return children
}
