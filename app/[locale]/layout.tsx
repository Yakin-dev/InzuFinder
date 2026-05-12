import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import '../globals.css'
import { PageTransition } from '@/components/PageTransition'

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased bg-warm-white text-gray-900">
        <NextIntlClientProvider 
          messages={messages}
          locale={locale}
          timeZone="Africa/Kigali"
        >
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
