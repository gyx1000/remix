export const localeOptions = [
  { locale: 'en', name: 'English' },
  { locale: 'fr-CH', name: 'Français (Suisse)' },
  { locale: 'it-CH', name: 'Italiano (Svizzera)' },
  { locale: 'de-CH', name: 'Deutsch (Schweiz)' },
] as const

export const localeNames: Record<string, string> = {
  en: 'English',
  'fr-CH': 'Français (Suisse)',
  'it-CH': 'Italiano (Svizzera)',
  'de-CH': 'Deutsch (Schweiz)',
}
