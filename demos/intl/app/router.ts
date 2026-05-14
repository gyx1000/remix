import { createRouter, type MiddlewareContext } from 'remix/fetch-router'
import { intl, type IntlCatalogs } from 'remix/intl'
import { logger } from 'remix/logger-middleware'
import { staticFiles } from 'remix/static-middleware'

import rootController from './actions/controller.tsx'
import { render } from './middleware/render.ts'
import { routes } from './routes.ts'

const supportedLocales = ['en', 'fr', 'fr-CH'] as const
const defaultLocale = 'en'

const catalogs: IntlCatalogs = {
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
}

const intlMiddleware = intl({
  supportedLocales,
  defaultLocale,
  catalogs,
  getLocale(context) {
    let url = new URL(context.request.url)
    return url.searchParams.get('locale')
  },
})

type AppContext = MiddlewareContext<[typeof intlMiddleware, ReturnType<typeof render>]>

declare module 'remix/fetch-router' {
  interface RouterTypes {
    context: AppContext
  }
}

const middleware = []

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger())
}

middleware.push(
  staticFiles('./public', {
    cacheControl: 'no-store',
    etag: false,
    lastModified: false,
    index: false,
  }),
)
middleware.push(intlMiddleware, render())

export const router = createRouter<AppContext>({ middleware })
router.map(routes, rootController)
