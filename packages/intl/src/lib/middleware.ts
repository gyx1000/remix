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

export interface IntlFallbackLocaleResolver {
  (locale: string, context: RequestContext): readonly string[]
}

export interface IntlMiddlewareOptions {
  supportedLocales: readonly string[]
  defaultLocale: string
  catalogs: IntlCatalogs
  getLocale?: IntlLocaleResolver
  fallbackLocales?: readonly string[] | IntlFallbackLocaleResolver
}

export function intl(
  options: IntlMiddlewareOptions,
): Middleware<
  readonly [
    { key: typeof Locale; value: string },
    { key: typeof Translator; value: TranslatorValue },
  ]
> {
  return async (context) => {
    let locale = await resolveLocale(context, options)
    let fallbackLocales =
      typeof options.fallbackLocales === 'function'
        ? options.fallbackLocales(locale, context)
        : options.fallbackLocales
    let translator = createTranslator({
      locale,
      defaultLocale: options.defaultLocale,
      catalogs: options.catalogs,
      fallbackLocales,
    })

    context.set(Locale, locale)
    context.set(Translator, translator)
  }
}

async function resolveLocale(
  context: RequestContext,
  options: IntlMiddlewareOptions,
): Promise<string> {
  let locale = await options.getLocale?.(context)
  if (locale !== null && locale !== undefined) {
    return normalizeSupportedLocale(locale, options)
  }

  let paramLocale = Object.getOwnPropertyDescriptor(context.params, 'locale')?.value
  if (typeof paramLocale === 'string' && options.supportedLocales.includes(paramLocale)) {
    return paramLocale
  }

  let acceptLanguage = AcceptLanguage.from(context.headers.get('Accept-Language'))
  return acceptLanguage.getPreferred(options.supportedLocales) ?? options.defaultLocale
}

function normalizeSupportedLocale(locale: string, options: IntlMiddlewareOptions): string {
  if (options.supportedLocales.includes(locale)) return locale

  let fallback = createBaseLocaleFallback(locale, options.supportedLocales)
  return fallback ?? options.defaultLocale
}

function createBaseLocaleFallback(
  locale: string,
  supportedLocales: readonly string[],
): string | null {
  let current = locale

  while (current.includes('-')) {
    current = current.slice(0, current.lastIndexOf('-'))
    if (supportedLocales.includes(current)) return current
  }

  return null
}
