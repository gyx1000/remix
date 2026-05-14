import type { RemixIntl } from 'remix/intl'

export interface IntlExample {
  name: string
  value: string
  description: string
}

export function getIntlExamples({
  intl,
  locale,
}: {
  intl: RemixIntl
  locale: string
}): IntlExample[] {
  let collator = intl.collator()

  return [
    {
      name: 'Intl.NumberFormat',
      value: intl.formatNumber(1234.5, { style: 'currency', currency: 'CHF' }),
      description: 'Currency and number formatting',
    },
    {
      name: 'Intl.DateTimeFormat',
      value: intl.formatDateTime(new Date('2026-05-14T10:30:00Z'), {
        timeZone: 'Europe/Zurich',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      description: 'Date, time, calendar, and timezone formatting',
    },
    {
      name: 'Intl.RelativeTimeFormat',
      value: intl.formatRelativeTime(-1, 'day', { numeric: 'auto' }),
      description: 'Human relative time',
    },
    {
      name: 'Intl.ListFormat',
      value: intl.formatList(['Remix', 'React', 'Vite']),
      description: 'Localized list separators',
    },
    {
      name: 'Intl.DisplayNames',
      value: intl.formatDisplayName('CH', { type: 'region' }),
      description: 'Localized names for regions, languages, scripts, and more',
    },
    {
      name: 'Intl.PluralRules',
      value: `2 → ${intl.selectPlural(2)}`,
      description: 'Locale-specific plural categories',
    },
    {
      name: 'Intl.Collator',
      value: ['zebra', 'éclair', 'avion'].sort(collator.compare).join(', '),
      description: 'Language-sensitive string sorting and comparison',
    },
    {
      name: 'Intl.Segmenter',
      value: [...intl.segment('Hello beautiful Remix world', { granularity: 'word' })]
        .filter((segment) => segment.isWordLike)
        .map((segment) => segment.segment)
        .join(' · '),
      description: 'Locale-aware text segmentation',
    },
    {
      name: 'Intl.Locale',
      value: `${intl.localeObject.language}${intl.localeObject.region ? `-${intl.localeObject.region}` : ''}`,
      description: 'Locale parsing and normalization',
    },
    {
      name: 'Intl.DurationFormat',
      value: formatDuration(locale),
      description: 'Localized structured durations when supported by the runtime',
    },
    {
      name: 'Intl.getCanonicalLocales',
      value: Intl.getCanonicalLocales(['FR-ch', 'en-us']).join(', '),
      description: 'Locale tag canonicalization',
    },
    {
      name: 'Intl.supportedValuesOf',
      value: supportedValuesSample('calendar'),
      description: 'Runtime-supported calendars, currencies, units, timezones, and more',
    },
  ]
}

function formatDuration(locale: string): string {
  let DurationFormat = (Intl as typeof Intl & {
    DurationFormat?: new (
      locales?: string | string[],
      options?: { style?: 'long' | 'short' | 'narrow' | 'digital' },
    ) => { format(duration: { hours: number; minutes: number }): string }
  }).DurationFormat

  if (DurationFormat === undefined) return 'Not supported by this runtime'

  return new DurationFormat(locale, { style: 'long' }).format({ hours: 1, minutes: 30 })
}

function supportedValuesSample(
  key: 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit',
): string {
  if (typeof Intl.supportedValuesOf !== 'function') return 'Not supported by this runtime'

  return Intl.supportedValuesOf(key).slice(0, 3).join(', ')
}
