import type { LazyMessage } from './lazy-message.ts'
import { createIntl, type IntlFormatValue, type RemixIntl } from './intl.ts'

export interface IntlPluralMessages {
  [key: string]: string | undefined
  zero?: string
  one?: string
  two?: string
  few?: string
  many?: string
  other: string
}

export type IntlMessage = string | IntlPluralMessages

export type IntlNamespaceCatalog = Record<string, IntlMessage | undefined>

export type IntlLocaleCatalog = Record<string, IntlNamespaceCatalog | undefined>

export type IntlCatalogs = Record<string, IntlLocaleCatalog | undefined>

export interface IntlMessageOptions {
  namespace?: string
  count?: number
  values?: Record<string, IntlFormatValue | unknown>
  defaultValue?: string
  context?: string
}

export interface IntlTranslatorOptions {
  locale: string
  defaultLocale: string
  catalogs: IntlCatalogs
  fallbackLocales?: readonly string[] | ((locale: string) => readonly string[])
  defaultNamespace?: string
  intl?: RemixIntl
}

export interface NamespaceTranslator {
  readonly locale: string
  readonly namespaceName: string
  t(key: string, options?: Omit<IntlMessageOptions, 'namespace'>): string
  gettext(message: string, options?: Omit<IntlMessageOptions, 'namespace'>): string
  pgettext(
    context: string,
    message: string,
    options?: Omit<IntlMessageOptions, 'namespace' | 'context'>,
  ): string
  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'namespace' | 'count'>,
  ): string
  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'namespace' | 'count' | 'context'>,
  ): string
}

export interface Translator {
  readonly locale: string
  readonly defaultLocale: string
  readonly defaultNamespace: string
  readonly fallbackChain: readonly string[]
  readonly intl: RemixIntl
  t(key: string, options?: IntlMessageOptions): string
  gettext(message: string, options?: IntlMessageOptions): string
  pgettext(context: string, message: string, options?: Omit<IntlMessageOptions, 'context'>): string
  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'count'>,
  ): string
  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'count' | 'context'>,
  ): string
  resolve(message: LazyMessage): string
  namespace(namespace: string): NamespaceTranslator
}

const defaultNamespace = 'common'

export function createLocaleFallbacks(locale: string, defaultLocale: string): string[] {
  let locales: string[] = []
  let current = locale

  while (current !== '') {
    appendUnique(locales, current)
    let index = current.lastIndexOf('-')
    if (index === -1) break
    current = current.slice(0, index)
  }

  appendUnique(locales, defaultLocale)
  return locales
}

export function createTranslator(options: IntlTranslatorOptions): Translator {
  return new DefaultTranslator(options)
}

class DefaultTranslator implements Translator {
  readonly locale: string
  readonly defaultLocale: string
  readonly defaultNamespace: string
  readonly fallbackChain: readonly string[]
  readonly intl: RemixIntl

  #catalogs: IntlCatalogs

  constructor(options: IntlTranslatorOptions) {
    this.locale = options.locale
    this.defaultLocale = options.defaultLocale
    this.defaultNamespace = options.defaultNamespace ?? defaultNamespace
    this.#catalogs = options.catalogs
    this.fallbackChain = resolveFallbackChain(options)
    this.intl = options.intl ?? createIntl(this.fallbackChain)
  }

  t(key: string, options: IntlMessageOptions = {}): string {
    let namespace = options.namespace ?? this.defaultNamespace
    let messageKey = options.context ? contextualKey(options.context, key) : key
    let message = this.#findMessage(namespace, messageKey)

    if (message === undefined && options.context) {
      message = this.#findMessage(namespace, key)
    }

    let fallback = options.defaultValue ?? key
    return this.#format(message, fallback, options)
  }

  gettext(message: string, options?: IntlMessageOptions): string {
    return this.t(message, options)
  }

  pgettext(
    context: string,
    message: string,
    options?: Omit<IntlMessageOptions, 'context'>,
  ): string {
    return this.t(message, { ...options, context })
  }

  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'count'>,
  ): string {
    return this.t(singular, {
      ...options,
      count,
      defaultValue: selectPluralFallback(this.intl, singular, plural, count),
    })
  }

  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'count' | 'context'>,
  ): string {
    return this.t(singular, {
      ...options,
      context,
      count,
      defaultValue: selectPluralFallback(this.intl, singular, plural, count),
    })
  }

  resolve(message: LazyMessage): string {
    switch (message.type) {
      case 'gettext':
        return this.gettext(message.message, message.options)
      case 'pgettext':
        return this.pgettext(message.context, message.message, message.options)
      case 'ngettext':
        return this.ngettext(message.singular, message.plural, message.count, message.options)
      case 'npgettext':
        return this.npgettext(
          message.context,
          message.singular,
          message.plural,
          message.count,
          message.options,
        )
    }
  }

  namespace(namespace: string): NamespaceTranslator {
    return new DefaultNamespaceTranslator(this, namespace)
  }

  #findMessage(namespace: string, key: string): IntlMessage | undefined {
    for (let locale of this.fallbackChain) {
      let message = this.#catalogs[locale]?.[namespace]?.[key]
      if (message !== undefined) return message
    }
  }

  #format(message: IntlMessage | undefined, fallback: string, options: IntlMessageOptions): string {
    let text = fallback

    if (typeof message === 'string') {
      text = message
    } else if (message !== undefined) {
      let category = this.intl.selectPlural(options.count ?? 0)
      text = message[category] ?? message.other
    }

    return interpolate(this.intl, text, options)
  }
}

class DefaultNamespaceTranslator implements NamespaceTranslator {
  readonly locale: string
  readonly namespaceName: string

  #translator: Translator

  constructor(translator: Translator, namespace: string) {
    this.#translator = translator
    this.locale = translator.locale
    this.namespaceName = namespace
  }

  t(key: string, options?: Omit<IntlMessageOptions, 'namespace'>): string {
    return this.#translator.t(key, { ...options, namespace: this.namespaceName })
  }

  gettext(message: string, options?: Omit<IntlMessageOptions, 'namespace'>): string {
    return this.t(message, options)
  }

  pgettext(
    context: string,
    message: string,
    options?: Omit<IntlMessageOptions, 'namespace' | 'context'>,
  ): string {
    return this.t(message, { ...options, context })
  }

  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'namespace' | 'count'>,
  ): string {
    return this.#translator.ngettext(singular, plural, count, {
      ...options,
      namespace: this.namespaceName,
    })
  }

  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<IntlMessageOptions, 'namespace' | 'count' | 'context'>,
  ): string {
    return this.#translator.npgettext(context, singular, plural, count, {
      ...options,
      namespace: this.namespaceName,
    })
  }
}

function resolveFallbackChain(options: IntlTranslatorOptions): readonly string[] {
  let fallbackLocales =
    typeof options.fallbackLocales === 'function'
      ? options.fallbackLocales(options.locale)
      : options.fallbackLocales

  if (fallbackLocales !== undefined) {
    let locales: string[] = []
    appendUnique(locales, options.locale)

    for (let locale of fallbackLocales) {
      appendUnique(locales, locale)
    }

    appendUnique(locales, options.defaultLocale)
    return locales
  }

  return createLocaleFallbacks(options.locale, options.defaultLocale)
}

function appendUnique(values: string[], value: string): void {
  if (!values.includes(value)) values.push(value)
}

function contextualKey(context: string, key: string): string {
  return `${context}\u0004${key}`
}

function selectPluralFallback(
  intl: RemixIntl,
  singular: string,
  plural: string,
  count: number,
): string {
  return intl.selectPlural(count) === 'one' ? singular : plural
}

function interpolate(intl: RemixIntl, message: string, options: IntlMessageOptions): string {
  let values = options.values ?? {}
  let count = options.count

  return message.replace(/%\{([^}]+)\}/g, (placeholder, name: string) => {
    if (name === 'count' && count !== undefined) return String(count)

    let value = values[name]
    return value === undefined ? placeholder : intl.formatValue(value)
  })
}
