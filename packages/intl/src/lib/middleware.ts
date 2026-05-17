import { createContextKey, type Middleware, type RequestContext } from '@remix-run/fetch-router'
import { AcceptLanguage } from '@remix-run/headers'

import {
  createTranslator,
  type IntlCatalogs,
  type Translator as TranslatorValue,
} from './translator.ts'

export const Locale = createContextKey<string>()
export const Translator = createContextKey<TranslatorValue>()

export interface IntlLocaleResolver {
  (context: RequestContext): string | null | undefined | Promise<string | null | undefined>
}

export interface IntlMiddlewareOptions {
  defaultLocale: string
  catalogs: IntlCatalogs
  getLocale?: IntlLocaleResolver
}

export function intl(
  options: IntlMiddlewareOptions,
): Middleware<
  readonly [
    { key: typeof Locale; value: string },
    { key: typeof Translator; value: TranslatorValue },
  ]
> {
  let catalogLocales = Object.keys(options.catalogs)
  let catalogLocaleSet = createLocaleSet(catalogLocales)

  return async (context) => {
    let locale = await resolveLocale(context, options, catalogLocaleSet)
    let translator = createTranslator({
      locale,
      defaultLocale: options.defaultLocale,
      catalogs: options.catalogs,
    })

    context.set(Locale, locale)
    context.set(Translator, translator)
  }
}

async function resolveLocale(
  context: RequestContext,
  options: IntlMiddlewareOptions,
  catalogLocaleSet: ReadonlySet<string>,
): Promise<string> {
  let locale = await options.getLocale?.(context)
  if (locale !== null && locale !== undefined) {
    return parseLocale(locale) ?? options.defaultLocale
  }

  let acceptLanguage = AcceptLanguage.from(context.headers.get('Accept-Language'))
  return resolveAcceptedLocale(acceptLanguage, catalogLocaleSet) ?? options.defaultLocale
}

function resolveAcceptedLocale(
  acceptLanguage: AcceptLanguage,
  catalogLocaleSet: ReadonlySet<string>,
): string | null {
  for (let locale of acceptLanguage.languages) {
    if (locale === '*') continue
    let parsedLocale = parseLocale(locale)
    if (parsedLocale !== null && hasCatalogLocaleFallback(parsedLocale, catalogLocaleSet)) {
      return parsedLocale
    }
  }

  return null
}

function hasCatalogLocaleFallback(locale: string, catalogLocaleSet: ReadonlySet<string>): boolean {
  if (catalogLocaleSet.has(locale.toLowerCase())) return true

  let current = locale
  while (current.includes('-')) {
    current = current.slice(0, current.lastIndexOf('-'))
    if (catalogLocaleSet.has(current.toLowerCase())) return true
  }

  return false
}

function createLocaleSet(locales: readonly string[]): ReadonlySet<string> {
  return new Set(locales.map((locale) => locale.toLowerCase()))
}

function parseLocale(locale: string): string | null {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? null
  } catch {
    return null
  }
}
