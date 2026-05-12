import { createRouter, type MiddlewareContext } from 'remix/fetch-router'
import { i18n } from 'remix/i18n'
import { logger } from 'remix/logger-middleware'
import { staticFiles } from 'remix/static-middleware'

import rootController from './actions/controller.tsx'
import { framesController } from './actions/frames/controller.tsx'
import { catalogs, defaultLocale, resolveLocaleFromRequest, supportedLocales } from './data/i18n.ts'
import { render } from './middleware/render.ts'
import { routes } from './routes.ts'

const i18nMiddleware = i18n({
  supportedLocales,
  defaultLocale,
  catalogs,
  getLocale(context) {
    return resolveLocaleFromRequest(context.request)
  },
})

type AppContext = MiddlewareContext<[typeof i18nMiddleware, ReturnType<typeof render>]>

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
middleware.push(i18nMiddleware, render())

export const router = createRouter<AppContext>({ middleware })
router.map(routes, rootController)
router.map(routes.frames, framesController)
