import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validLocales = ['en', 'rw']
  const validLocale = validLocales.includes(locale ?? '') 
    ? locale! 
    : 'en'

  let messages
  try {
    messages = (
      await import(`../messages/${validLocale}.json`)
    ).default
  } catch {
    // Fallback to English if translation file missing
    messages = (await import('../messages/en.json')).default
  }

  return {
    locale: validLocale,
    messages,
    timeZone: 'Africa/Kigali',
    now: new Date(),
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        // Don't crash on missing keys
        return
      }
      console.error(error)
    },
    getMessageFallback({ namespace, key }) {
      return [namespace, key].filter(Boolean).join('.')
    }
  }
})
