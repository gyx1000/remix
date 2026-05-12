import { createContextKey, type Middleware, type RequestContext } from '@remix-run/fetch-router'
import { AcceptLanguage } from '@remix-run/headers'

import {
  createTranslator,
  type I18nCatalogs,
  type Translator as TranslatorValue,
} from './translator.ts'

export const Locale = createContextKey<string>()
export const Translator = createContextKey<TranslatorValue>()

export interface I18nLocaleResolver {
  (context: RequestContext): string | null | undefined | Promise<string | null | undefined>
}

export interface I18nFallbackLocaleResolver {
  (locale: string, context: RequestContext): readonly string[]
}

export interface I18nMiddlewareOptions {
  supportedLocales: readonly string[]
  defaultLocale: string
  catalogs: I18nCatalogs
  defaultNamespace?: string
  getLocale?: I18nLocaleResolver
  fallbackLocales?: readonly string[] | I18nFallbackLocaleResolver
}

export function i18n(
  options: I18nMiddlewareOptions,
): Middleware<readonly [[typeof Locale, string], [typeof Translator, TranslatorValue]]> {
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
      defaultNamespace: options.defaultNamespace,
      fallbackLocales,
    })

    context.set(Locale, locale)
    context.set(Translator, translator)
  }
}

async function resolveLocale(
  context: RequestContext,
  options: I18nMiddlewareOptions,
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

function normalizeSupportedLocale(locale: string, options: I18nMiddlewareOptions): string {
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
