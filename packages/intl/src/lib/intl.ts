export type IntlLocale = string | readonly string[]

export type IntlLocaleMatcher = 'best fit' | 'lookup'

export type IntlDateTimeValue = Date | number | string

export type IntlListValue = Iterable<string>

export type IntlFormatValue =
  | { type: 'number'; value: number | bigint; options?: Intl.NumberFormatOptions }
  | { type: 'dateTime'; value: IntlDateTimeValue; options?: Intl.DateTimeFormatOptions }
  | {
      type: 'relativeTime'
      value: number
      unit: Intl.RelativeTimeFormatUnit
      options?: Intl.RelativeTimeFormatOptions
    }
  | { type: 'list'; value: IntlListValue; options?: Intl.ListFormatOptions }
  | {
      type: 'displayName'
      value: string
      options: Intl.DisplayNamesOptions
    }
  | { type: 'string'; value: unknown }

export interface RemixIntlOptions {
  localeMatcher?: IntlLocaleMatcher
}

export interface RemixIntl {
  readonly locales: readonly string[]
  readonly locale: string
  readonly localeObject: Intl.Locale

  number(options?: Intl.NumberFormatOptions): Intl.NumberFormat
  dateTime(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat
  relativeTime(options?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat
  list(options?: Intl.ListFormatOptions): Intl.ListFormat
  displayNames(options: Intl.DisplayNamesOptions): Intl.DisplayNames
  pluralRules(options?: Intl.PluralRulesOptions): Intl.PluralRules
  collator(options?: Intl.CollatorOptions): Intl.Collator
  segmenter(options?: Intl.SegmenterOptions): Intl.Segmenter

  formatNumber(value: number | bigint, options?: Intl.NumberFormatOptions): string
  formatDateTime(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string
  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string
  formatList(value: IntlListValue, options?: Intl.ListFormatOptions): string
  formatDisplayName(value: string, options: Intl.DisplayNamesOptions): string
  selectPlural(value: number, options?: Intl.PluralRulesOptions): Intl.LDMLPluralRule
  compare(left: string, right: string, options?: Intl.CollatorOptions): number
  segment(input: string, options?: Intl.SegmenterOptions): Iterable<Intl.SegmentData>
  formatValue(value: IntlFormatValue | unknown): string
}

export function createIntl(locales: IntlLocale, options: RemixIntlOptions = {}): RemixIntl {
  return new DefaultRemixIntl(locales, options)
}

export function number(
  value: number | bigint,
  options?: Intl.NumberFormatOptions,
): IntlFormatValue {
  return { type: 'number', value, options }
}

export function dateTime(
  value: IntlDateTimeValue,
  options?: Intl.DateTimeFormatOptions,
): IntlFormatValue {
  return { type: 'dateTime', value, options }
}

export function relativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
): IntlFormatValue {
  return { type: 'relativeTime', value, unit, options }
}

export function list(value: IntlListValue, options?: Intl.ListFormatOptions): IntlFormatValue {
  return { type: 'list', value, options }
}

export function displayName(value: string, options: Intl.DisplayNamesOptions): IntlFormatValue {
  return { type: 'displayName', value, options }
}

class DefaultRemixIntl implements RemixIntl {
  readonly locales: readonly string[]
  readonly locale: string
  readonly localeObject: Intl.Locale

  #localeMatcher?: IntlLocaleMatcher

  constructor(locales: IntlLocale, options: RemixIntlOptions) {
    this.locales = Array.isArray(locales) ? [...locales] : [locales]
    this.#localeMatcher = options.localeMatcher
    this.locale =
      Intl.NumberFormat.supportedLocalesOf(this.locales, {
        localeMatcher: options.localeMatcher,
      })[0] ??
      this.locales[0] ??
      'en'
    this.localeObject = new Intl.Locale(this.locale)
  }

  number(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locales, this.#withLocaleMatcher(options))
  }

  dateTime(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.locales, this.#withLocaleMatcher(options))
  }

  relativeTime(options?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
    return new Intl.RelativeTimeFormat(this.locales, this.#withLocaleMatcher(options))
  }

  list(options?: Intl.ListFormatOptions): Intl.ListFormat {
    return new Intl.ListFormat(this.locales, this.#withLocaleMatcher(options))
  }

  displayNames(options: Intl.DisplayNamesOptions): Intl.DisplayNames {
    return new Intl.DisplayNames(this.locales, this.#withLocaleMatcher(options))
  }

  pluralRules(options?: Intl.PluralRulesOptions): Intl.PluralRules {
    return new Intl.PluralRules(this.locales, this.#withLocaleMatcher(options))
  }

  collator(options?: Intl.CollatorOptions): Intl.Collator {
    return new Intl.Collator(this.locales, this.#withLocaleMatcher(options))
  }

  segmenter(options?: Intl.SegmenterOptions): Intl.Segmenter {
    return new Intl.Segmenter(this.locales, options)
  }

  formatNumber(value: number | bigint, options?: Intl.NumberFormatOptions): string {
    return this.number(options).format(value)
  }

  formatDateTime(value: IntlDateTimeValue, options?: Intl.DateTimeFormatOptions): string {
    return this.dateTime(options).format(toDateTimeValue(value))
  }

  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string {
    return this.relativeTime(options).format(value, unit)
  }

  formatList(value: IntlListValue, options?: Intl.ListFormatOptions): string {
    return this.list(options).format([...value])
  }

  formatDisplayName(value: string, options: Intl.DisplayNamesOptions): string {
    return this.displayNames(options).of(value) ?? value
  }

  selectPlural(value: number, options?: Intl.PluralRulesOptions): Intl.LDMLPluralRule {
    return this.pluralRules(options).select(value)
  }

  compare(left: string, right: string, options?: Intl.CollatorOptions): number {
    return this.collator(options).compare(left, right)
  }

  segment(input: string, options?: Intl.SegmenterOptions): Iterable<Intl.SegmentData> {
    return this.segmenter(options).segment(input)
  }

  formatValue(value: IntlFormatValue | unknown): string {
    if (!isIntlFormatValue(value)) return String(value)

    switch (value.type) {
      case 'number':
        return this.formatNumber(value.value, value.options)
      case 'dateTime':
        return this.formatDateTime(value.value, value.options)
      case 'relativeTime':
        return this.formatRelativeTime(value.value, value.unit, value.options)
      case 'list':
        return this.formatList(value.value, value.options)
      case 'displayName':
        return this.formatDisplayName(value.value, value.options)
      case 'string':
        return String(value.value)
    }
  }

  #withLocaleMatcher<T extends { localeMatcher?: IntlLocaleMatcher }>(options: T | undefined): T {
    if (this.#localeMatcher === undefined) return options ?? ({} as T)
    return { ...options, localeMatcher: this.#localeMatcher } as T
  }
}

function isIntlFormatValue(value: unknown): value is IntlFormatValue {
  return typeof value === 'object' && value !== null && 'type' in value && 'value' in value
}

function toDateTimeValue(value: IntlDateTimeValue): Date | number {
  if (typeof value === 'string') return new Date(value)
  return value
}
