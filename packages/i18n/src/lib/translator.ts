import type { LazyMessage } from './lazy-message.ts'

export interface I18nPluralMessages {
  [key: string]: string | undefined
  zero?: string
  one?: string
  two?: string
  few?: string
  many?: string
  other: string
}

export type I18nMessage = string | I18nPluralMessages

export type I18nNamespaceCatalog = Record<string, I18nMessage | undefined>

export type I18nLocaleCatalog = Record<string, I18nNamespaceCatalog | undefined>

export type I18nCatalogs = Record<string, I18nLocaleCatalog | undefined>

export type I18nClientPrimitive = string | number | boolean | null | undefined

export type I18nClientObject = {
  [key: string]: I18nClientValue
}

export type I18nClientArray = I18nClientValue[]

export type I18nClientValue = I18nClientPrimitive | I18nClientObject | I18nClientArray

export interface I18nMessageOptions {
  namespace?: string
  count?: number
  values?: Record<string, unknown>
  defaultValue?: string
  context?: string
}

export interface I18nClientState extends I18nClientObject {
  locale: string
  fallbackChain: string[]
  namespaces: Record<string, I18nNamespaceCatalog>
}

export interface I18nTranslatorOptions {
  locale: string
  defaultLocale: string
  catalogs: I18nCatalogs
  fallbackLocales?: readonly string[] | ((locale: string) => readonly string[])
  defaultNamespace?: string
}

export interface NamespaceTranslator {
  readonly locale: string
  readonly namespaceName: string
  t(key: string, options?: Omit<I18nMessageOptions, 'namespace'>): string
  gettext(message: string, options?: Omit<I18nMessageOptions, 'namespace'>): string
  pgettext(
    context: string,
    message: string,
    options?: Omit<I18nMessageOptions, 'namespace' | 'context'>,
  ): string
  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'namespace' | 'count'>,
  ): string
  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'namespace' | 'count' | 'context'>,
  ): string
}

export interface Translator {
  readonly locale: string
  readonly defaultLocale: string
  readonly defaultNamespace: string
  readonly fallbackChain: readonly string[]
  t(key: string, options?: I18nMessageOptions): string
  gettext(message: string, options?: I18nMessageOptions): string
  pgettext(context: string, message: string, options?: Omit<I18nMessageOptions, 'context'>): string
  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'count'>,
  ): string
  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'count' | 'context'>,
  ): string
  resolve(message: LazyMessage): string
  namespace(namespace: string): NamespaceTranslator
  clientState(options: { namespaces: readonly string[] }): I18nClientState
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

export function createTranslator(options: I18nTranslatorOptions): Translator {
  return new DefaultTranslator(options)
}

class DefaultTranslator implements Translator {
  readonly locale: string
  readonly defaultLocale: string
  readonly defaultNamespace: string
  readonly fallbackChain: readonly string[]

  #catalogs: I18nCatalogs
  #pluralRules: Intl.PluralRules

  constructor(options: I18nTranslatorOptions) {
    this.locale = options.locale
    this.defaultLocale = options.defaultLocale
    this.defaultNamespace = options.defaultNamespace ?? defaultNamespace
    this.#catalogs = options.catalogs
    this.fallbackChain = resolveFallbackChain(options)
    this.#pluralRules = new Intl.PluralRules(this.locale)
  }

  t(key: string, options: I18nMessageOptions = {}): string {
    let namespace = options.namespace ?? this.defaultNamespace
    let messageKey = options.context ? contextualKey(options.context, key) : key
    let message = this.#findMessage(namespace, messageKey)

    if (message === undefined && options.context) {
      message = this.#findMessage(namespace, key)
    }

    let fallback = options.defaultValue ?? key
    return this.#format(message, fallback, options)
  }

  gettext(message: string, options?: I18nMessageOptions): string {
    return this.t(message, options)
  }

  pgettext(
    context: string,
    message: string,
    options?: Omit<I18nMessageOptions, 'context'>,
  ): string {
    return this.t(message, { ...options, context })
  }

  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'count'>,
  ): string {
    return this.t(singular, {
      ...options,
      count,
      defaultValue: selectPluralFallback(this.#pluralRules, singular, plural, count),
    })
  }

  npgettext(
    context: string,
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'count' | 'context'>,
  ): string {
    return this.t(singular, {
      ...options,
      context,
      count,
      defaultValue: selectPluralFallback(this.#pluralRules, singular, plural, count),
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

  clientState(options: { namespaces: readonly string[] }): I18nClientState {
    let namespaces: Record<string, I18nNamespaceCatalog> = {}

    for (let namespace of options.namespaces) {
      namespaces[namespace] = this.#mergeNamespace(namespace)
    }

    return {
      locale: this.locale,
      fallbackChain: [...this.fallbackChain],
      namespaces,
    }
  }

  #findMessage(namespace: string, key: string): I18nMessage | undefined {
    for (let locale of this.fallbackChain) {
      let message = this.#catalogs[locale]?.[namespace]?.[key]
      if (message !== undefined) return message
    }
  }

  #mergeNamespace(namespace: string): I18nNamespaceCatalog {
    let messages: I18nNamespaceCatalog = {}

    for (let i = this.fallbackChain.length - 1; i >= 0; i--) {
      let locale = this.fallbackChain[i]
      if (locale === undefined) continue

      let catalog = this.#catalogs[locale]?.[namespace]
      if (catalog === undefined) continue

      for (let key of Object.keys(catalog)) {
        let message = catalog[key]
        if (message !== undefined) {
          messages[key] = cloneMessage(message)
        }
      }
    }

    return messages
  }

  #format(message: I18nMessage | undefined, fallback: string, options: I18nMessageOptions): string {
    let text = fallback

    if (typeof message === 'string') {
      text = message
    } else if (message !== undefined) {
      let category = this.#pluralRules.select(options.count ?? 0)
      text = message[category] ?? message.other
    }

    return interpolate(text, options)
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

  t(key: string, options?: Omit<I18nMessageOptions, 'namespace'>): string {
    return this.#translator.t(key, { ...options, namespace: this.namespaceName })
  }

  gettext(message: string, options?: Omit<I18nMessageOptions, 'namespace'>): string {
    return this.t(message, options)
  }

  pgettext(
    context: string,
    message: string,
    options?: Omit<I18nMessageOptions, 'namespace' | 'context'>,
  ): string {
    return this.t(message, { ...options, context })
  }

  ngettext(
    singular: string,
    plural: string,
    count: number,
    options?: Omit<I18nMessageOptions, 'namespace' | 'count'>,
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
    options?: Omit<I18nMessageOptions, 'namespace' | 'count' | 'context'>,
  ): string {
    return this.#translator.npgettext(context, singular, plural, count, {
      ...options,
      namespace: this.namespaceName,
    })
  }
}

function resolveFallbackChain(options: I18nTranslatorOptions): readonly string[] {
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
  pluralRules: Intl.PluralRules,
  singular: string,
  plural: string,
  count: number,
): string {
  return pluralRules.select(count) === 'one' ? singular : plural
}

function interpolate(message: string, options: I18nMessageOptions): string {
  let values = options.values ?? {}
  let count = options.count

  return message.replace(/%\{([^}]+)\}/g, (placeholder, name: string) => {
    if (name === 'count' && count !== undefined) return String(count)

    let value = values[name]
    return value === undefined ? placeholder : String(value)
  })
}

function cloneMessage(message: I18nMessage): I18nMessage {
  if (typeof message === 'string') return message
  return { ...message }
}
