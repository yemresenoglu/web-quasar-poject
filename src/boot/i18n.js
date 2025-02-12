import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import enUS from 'src/i18n/en-US'
import trTR from 'src/i18n/tr-TR'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US', // Default language
    fallbackLocale: 'tr-TR', // Fallback language
    globalInjection: true,
    legacy: false, // Use Composition API
    sync: true, // Sync translations with locale changes
    silentTranslationWarn: true, // Suppress warnings for missing translations
    messages: {
      'en-US': enUS,
      'tr-TR': trTR
    }
  })

  // Set i18n instance on app
  app.use(i18n)
})
