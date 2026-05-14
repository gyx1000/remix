export const localeOptions = [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
  { locale: 'fr-CH', name: 'Français (Suisse)' },
] as const

export const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  'fr-CH': 'Français (Suisse)',
}
