import {
  createIntl,
  dateTime,
  type IntlDateTimeValue,
  type IntlFormatValue,
  type RemixIntl,
} from './intl.ts'

export type IntlPluralMessages = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string
}

export interface IntlMessageFunctionInput {
  count?: number
  values: Record<string, IntlFormatValue | unknown>
}

export interface IntlMessageFunction {
  (input: IntlMessageFunctionInput): string
}

export type IntlMessage = string | IntlPluralMessages | IntlMessageFunction

export interface IntlMessageCatalog {
  [key: string]: IntlMessage | IntlMessageCatalog | undefined
}

export type IntlLocaleCatalog = IntlMessageCatalog

export type IntlCatalogs = Record<string, IntlLocaleCatalog | undefined>

export interface IntlMessageOptions {
  count?: number
  values?: Record<string, IntlFormatValue | unknown>
  defaultValue?: string
}

export interface IntlTranslatorOptions {
  locale: string
  defaultLocale: string
  catalogs: IntlCatalogs
  intl?: RemixIntl
}

export interface ScopedTranslator {
  readonly locale: string
  readonly scopeName: string
  t(key: string, options?: IntlMessageOptions): string
  translate(key: string, options?: IntlMessageOptions): string
}

export interface Translator {
  readonly locale: string
  readonly defaultLocale: string
  readonly fallbackChain: readonly string[]
  readonly intl: RemixIntl
  t(key: string, options?: IntlMessageOptions): string
  translate(key: string, options?: IntlMessageOptions): string
  l(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string
  localize(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string
  s(scope: string): ScopedTranslator
  scope(scope: string): ScopedTranslator
}

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
  readonly fallbackChain: readonly string[]
  readonly intl: RemixIntl

  #catalogs: IntlCatalogs

  constructor(options: IntlTranslatorOptions) {
    this.locale = options.locale
    this.defaultLocale = options.defaultLocale
    this.#catalogs = options.catalogs
    this.fallbackChain = resolveFallbackChain(options)
    this.intl = options.intl ?? createIntl(this.fallbackChain)
  }

  t(key: string, options: IntlMessageOptions = {}): string {
    let message = this.#findMessage(key)
    let fallback = options.defaultValue ?? key
    return this.#format(message, fallback, options)
  }

  translate(key: string, options?: IntlMessageOptions): string {
    return this.t(key, options)
  }

  l(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string {
    return this.localize(value, options)
  }

  localize(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string {
    return this.intl.formatValue(dateTime(value, options))
  }

  s(scope: string): ScopedTranslator {
    return this.scope(scope)
  }

  scope(scope: string): ScopedTranslator {
    return new DefaultScopedTranslator(this, scope)
  }

  #findMessage(key: string): IntlMessage | undefined {
    for (let locale of this.fallbackChain) {
      let message = findCatalogMessage(this.#catalogs[locale], key)
      if (message !== undefined) return message
    }
  }

  #format(message: IntlMessage | undefined, fallback: string, options: IntlMessageOptions): string {
    let text = fallback

    if (typeof message === 'string') {
      text = message
    } else if (typeof message === 'function') {
      return message({
        count: options.count,
        values: options.values ?? {},
      })
    } else if (message !== undefined) {
      let category = this.intl.selectPlural(options.count ?? 0)
      text =
        options.count === 0
          ? (message.zero ?? message[category] ?? message.other)
          : (message[category] ?? message.other)
    }

    return interpolate(this.intl, text, options)
  }
}

class DefaultScopedTranslator implements ScopedTranslator {
  readonly locale: string
  readonly scopeName: string

  #translator: Translator

  constructor(translator: Translator, scope: string) {
    this.#translator = translator
    this.locale = translator.locale
    this.scopeName = scope
  }

  t(key: string, options: IntlMessageOptions = {}): string {
    return this.#translator.t(resolveScopedKey(this.scopeName, key), options)
  }

  translate(key: string, options?: IntlMessageOptions): string {
    return this.t(key, options)
  }
}

function resolveFallbackChain(options: IntlTranslatorOptions): readonly string[] {
  return createLocaleFallbacks(options.locale, options.defaultLocale)
}

function appendUnique(values: string[], value: string): void {
  if (!values.includes(value)) values.push(value)
}

function resolveScopedKey(scope: string, key: string): string {
  return [scope, key].filter((part) => part !== '').join('.')
}

function findCatalogMessage(
  catalog: IntlLocaleCatalog | undefined,
  key: string,
): IntlMessage | undefined {
  if (catalog === undefined) return undefined

  let current: IntlMessageCatalog | IntlMessage | undefined = catalog
  let segments = key.split('.')

  for (let index = 0; index < segments.length; index++) {
    if (!isMessageCatalog(current) || isIntlPluralMessages(current)) return undefined

    let remainingKey = segments.slice(index).join('.')
    let direct = current[remainingKey]
    if (isIntlMessage(direct)) return direct

    current = current[segments[index]]
  }

  return isIntlMessage(current) ? current : undefined
}

function isIntlMessage(value: IntlMessage | IntlMessageCatalog | undefined): value is IntlMessage {
  return typeof value === 'string' || typeof value === 'function' || isIntlPluralMessages(value)
}

function isIntlPluralMessages(
  value: IntlMessage | IntlMessageCatalog | undefined,
): value is IntlPluralMessages {
  return isMessageCatalog(value) && typeof value.other === 'string'
}

function isMessageCatalog(
  value: IntlMessage | IntlMessageCatalog | undefined,
): value is IntlMessageCatalog {
  return typeof value === 'object' && value !== null
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
