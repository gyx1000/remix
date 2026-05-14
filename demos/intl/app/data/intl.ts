export const localeOptions = [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
  { locale: 'fr-CH', name: 'Français (Suisse)' },
  { locale: 'de-CH', name: 'Deutsch (Schweiz)' },
  { locale: 'it-CH', name: 'Italiano (Svizzera)' },
] as const

export const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  'fr-CH': 'Français (Suisse)',
  'de-CH': 'Deutsch (Schweiz)',
  'it-CH': 'Italiano (Svizzera)',
}
