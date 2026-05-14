import { createRouter, type MiddlewareContext } from 'remix/fetch-router'
import { intl } from 'remix/intl'
import { logger } from 'remix/logger-middleware'
import { staticFiles } from 'remix/static-middleware'

import rootController from './actions/controller.tsx'
import { catalogs } from './data/catalogs.ts'
import { render } from './middleware/render.ts'
import { routes } from './routes.ts'

const intlMiddleware = intl({
  supportedLocales: ['en', 'fr', 'fr-CH', 'it-CH', 'de-CH'] as const,
  defaultLocale: 'en',
  catalogs,
  getLocale(context) {
    let url = new URL(context.request.url)
    return url.searchParams.get('locale')
  },
  fallbackLocales(locale) {
    if (locale === 'fr-CH') return ['fr']
    if (locale === 'it-CH') return ['it']
    if (locale === 'de-CH') return ['de']
    return []
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
