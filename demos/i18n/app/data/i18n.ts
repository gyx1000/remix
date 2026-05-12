import type { I18nCatalogs } from 'remix/i18n'

export const supportedLocales = ['en', 'fr', 'fr-CH'] as const
export const defaultLocale = 'en'

export const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  'fr-CH': 'Français (Suisse)',
}

export const catalogs: I18nCatalogs = {
  en: {
    common: {
      'app.title': 'Remix i18n',
      'app.subtitle': 'One request-scoped translator across SSR, hydration, and Frames.',
      'language.label': 'Language',
      'language.submit': 'Reload document',
      'nav.home': 'Overview',
      'section.ssr': 'Full SSR',
      'section.hydration': 'Hydrated component',
      'section.frame': 'Frame request',
      'badge.locale': 'Active locale',
      'badge.fallbacks': 'Fallback chain',
      'button.save': 'Save',
      'button.clear': 'Clear',
      'counter.label': 'Client counter',
      'counter.count': {
        one: '%{count} click',
        other: '%{count} clicks',
      },
      'frame.reload': 'Reload frame',
    },
    home: {
      'hero.title': 'Internationalization without global state',
      'hero.copy':
        'The server negotiates the locale, flattens fallback catalogs, and sends only the namespaces this page needs.',
      'ssr.copy':
        'This card is rendered entirely on the server. Switch to Swiss French to see "Checkout" come from fr-CH while "Save" falls back to fr.',
      'checkout.label': 'Checkout',
      'payload.title': 'Client namespaces',
      'payload.copy':
        'The hydrated island receives common and home messages only. Other application catalogs are never serialized for this page.',
    },
    frame: {
      title: 'Translated frame',
      copy: 'This content was fetched through the router as a separate request, so it negotiated the same locale and built its own client state.',
      status: 'Inventory synchronized at %{time}',
    },
  },
  fr: {
    common: {
      'app.title': 'Remix i18n',
      'app.subtitle': 'Un traducteur par requête pour le SSR, l’hydratation et les Frames.',
      'language.label': 'Langue',
      'language.submit': 'Recharger le document',
      'nav.home': 'Vue d’ensemble',
      'section.ssr': 'SSR complet',
      'section.hydration': 'Composant hydraté',
      'section.frame': 'Requête Frame',
      'badge.locale': 'Locale active',
      'badge.fallbacks': 'Chaîne de fallback',
      'button.save': 'Enregistrer',
      'button.clear': 'Effacer',
      'counter.label': 'Compteur client',
      'counter.count': {
        one: '%{count} clic',
        other: '%{count} clics',
      },
      'frame.reload': 'Recharger la frame',
    },
    home: {
      'hero.title': 'Internationalisation sans état global',
      'hero.copy':
        'Le serveur négocie la locale, aplatit les catalogues de fallback, et envoie uniquement les namespaces nécessaires à cette page.',
      'ssr.copy':
        'Cette carte est entièrement rendue côté serveur. Passez en français suisse pour voir "Checkout" venir de fr-CH pendant que "Save" retombe sur fr.',
      'checkout.label': 'Paiement',
      'payload.title': 'Namespaces client',
      'payload.copy':
        'L’îlot hydraté reçoit seulement les messages common et home. Les autres catalogues de l’application ne sont jamais sérialisés pour cette page.',
    },
    frame: {
      title: 'Frame traduite',
      copy: 'Ce contenu a été récupéré via le routeur comme une requête séparée, donc il a négocié la même locale et construit son propre état client.',
      status: 'Inventaire synchronisé à %{time}',
    },
  },
  'fr-CH': {
    common: {
      'language.submit': 'Recharger la page',
      'button.clear': 'Réinitialiser',
    },
    home: {
      'checkout.label': 'Commande',
    },
    frame: {
      status: 'Stock synchronisé à %{time}',
    },
  },
}

export function resolveLocaleFromRequest(request: Request): string | null {
  let url = new URL(request.url)
  return url.searchParams.get('locale')
}

export function withLocale(pathname: string, locale: string): string {
  let url = new URL(pathname, 'https://example.com')
  url.searchParams.set('locale', locale)
  return `${url.pathname}${url.search}`
}
