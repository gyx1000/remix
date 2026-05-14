import type { IntlCatalogs } from 'remix/intl'

export const catalogs = {
  en: {
    common: {
      'app.title': 'Remix Intl',
      'app.subtitle': 'One request-scoped translator across SSR, hydration, and Frames.',
      'language.label': 'Language',
      'language.submit': 'Reload document',
      'nav.home': 'Overview',
      'section.ssr': 'Full SSR',
      'section.namespaces': 'Namespaces',
      'section.intl': 'Native Intl examples',
      'badge.locale': 'Active locale',
      'badge.fallbacks': 'Fallback chain',
      'button.save': 'Save',
    },
    home: {
      'hero.title': 'Internationalization without global state',
      'hero.copy':
        'The server negotiates the locale, resolves fallback catalogs, and renders translated HTML for each request.',
      'ssr.copy':
        'This card is rendered entirely on the server. Switch to Swiss French to see "Checkout" come from fr-CH while "Save" falls back to fr.',
      'checkout.label': 'Checkout',
      'namespaces.copy':
        'Route code can use small namespace-scoped translators while all translation lookup stays on the server.',
      'intl.copy':
        'The request-scoped translator also exposes cached native Intl primitives for formatting, sorting, segmenting, and inspecting locale data.',
      'intl.numberFormat.description': 'Currency and number formatting',
      'intl.dateTimeFormat.description': 'Date, time, calendar, and timezone formatting',
      'intl.relativeTimeFormat.description': 'Human relative time',
      'intl.listFormat.description': 'Localized list separators',
      'intl.displayNames.description': 'Localized names for regions, languages, scripts, and more',
      'intl.pluralRules.description': 'Locale-specific plural categories',
      'intl.collator.description': 'Language-sensitive string sorting and comparison',
      'intl.segmenter.description': 'Locale-aware text segmentation',
      'intl.locale.description': 'Locale parsing and normalization',
      'intl.durationFormat.description':
        'Localized structured durations when supported by the runtime',
      'intl.getCanonicalLocales.description': 'Locale tag canonicalization',
      'intl.supportedValuesOf.description':
        'Runtime-supported calendars, currencies, units, timezones, and more',
    },
  },
  fr: {
    common: {
      'app.title': 'Remix Intl',
      'app.subtitle': 'Un traducteur par requête pour le SSR, l’hydratation et les Frames.',
      'language.label': 'Langue',
      'language.submit': 'Recharger le document',
      'nav.home': 'Vue d’ensemble',
      'section.ssr': 'SSR complet',
      'section.namespaces': 'Namespaces',
      'section.intl': 'Exemples Intl natifs',
      'badge.locale': 'Locale active',
      'badge.fallbacks': 'Chaîne de fallback',
      'button.save': 'Enregistrer',
    },
    home: {
      'hero.title': 'Internationalisation sans état global',
      'hero.copy':
        'Le serveur négocie la locale, résout les catalogues de fallback, et rend le HTML traduit à chaque requête.',
      'ssr.copy':
        'Cette carte est entièrement rendue côté serveur. Passez en français suisse pour voir "Checkout" venir de fr-CH pendant que "Save" retombe sur fr.',
      'checkout.label': 'Paiement',
      'namespaces.copy':
        'Le code des routes peut utiliser de petits traducteurs par namespace pendant que toute la traduction reste côté serveur.',
      'intl.copy':
        'Le traducteur de la requête expose aussi des primitives Intl natives mises en cache pour formater, trier, segmenter et inspecter les données de locale.',
      'intl.numberFormat.description': 'Formatage des devises et des nombres',
      'intl.dateTimeFormat.description':
        'Formatage des dates, heures, calendriers et fuseaux horaires',
      'intl.relativeTimeFormat.description': 'Temps relatif lisible',
      'intl.listFormat.description': 'Séparateurs de listes localisés',
      'intl.displayNames.description':
        'Noms localisés pour les régions, langues, écritures et plus encore',
      'intl.pluralRules.description': 'Catégories de pluriel propres à la locale',
      'intl.collator.description': 'Tri et comparaison de chaînes sensibles à la langue',
      'intl.segmenter.description': 'Segmentation de texte adaptée à la locale',
      'intl.locale.description': 'Analyse et normalisation des tags de locale',
      'intl.durationFormat.description':
        'Durées structurées localisées lorsque le runtime les prend en charge',
      'intl.getCanonicalLocales.description': 'Canonicalisation des tags de locale',
      'intl.supportedValuesOf.description':
        'Calendriers, devises, unités, fuseaux horaires et autres valeurs pris en charge par le runtime',
    },
  },
  'fr-CH': {
    common: {
      'language.submit': 'Recharger la page',
    },
    home: {
      'checkout.label': 'Commande',
    },
  },
} satisfies IntlCatalogs
