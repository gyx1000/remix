import type { RemixIntl, TranslatorValue } from 'remix/intl'

export interface IntlExample {
  name: string
  value: string
  description: string
}

export function getIntlExamples({
  intl,
  locale,
  translator,
}: {
  intl: RemixIntl
  locale: string
  translator: TranslatorValue
}): IntlExample[] {
  let collator = intl.collator()

  return [
    {
      name: 'Intl.NumberFormat',
      value: intl.formatNumber(1234.5, { style: 'currency', currency: 'CHF' }),
      description: translator.t('numberFormat.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.DateTimeFormat',
      value: intl.formatDateTime(new Date('2026-05-14T10:30:00Z'), {
        timeZone: 'Europe/Zurich',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      description: translator.t('dateTimeFormat.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.RelativeTimeFormat',
      value: intl.formatRelativeTime(-1, 'day', { numeric: 'auto' }),
      description: translator.t('relativeTimeFormat.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.ListFormat',
      value: intl.formatList(['Remix', 'React', 'Vite']),
      description: translator.t('listFormat.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.DisplayNames',
      value: [
        `Region: ${intl.formatDisplayName('CH', { type: 'region' })}`,
        `Language: ${intl.formatDisplayName('de', { type: 'language' })}`,
        `Currency: ${intl.formatDisplayName('CHF', { type: 'currency' })}`,
        `Calendar: ${intl.formatDisplayName('gregory', { type: 'calendar' })}`,
      ].join('\n'),
      description: translator.t('displayNames.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.PluralRules',
      value: `2 → ${intl.selectPlural(2)}`,
      description: translator.t('pluralRules.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.Collator',
      value: ['zebra', 'éclair', 'avion'].sort(collator.compare).join(', '),
      description: translator.t('collator.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.Segmenter',
      value: [...intl.segment('Hello beautiful Remix world', { granularity: 'word' })]
        .filter((segment) => segment.isWordLike)
        .map((segment) => segment.segment)
        .join(' · '),
      description: translator.t('segmenter.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.Locale',
      value: `${intl.localeObject.language}${intl.localeObject.region ? `-${intl.localeObject.region}` : ''}`,
      description: translator.t('locale.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.DurationFormat',
      value: formatDuration(locale),
      description: translator.t('durationFormat.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.getCanonicalLocales',
      value: Intl.getCanonicalLocales(['FR-ch', 'en-us']).join(', '),
      description: translator.t('getCanonicalLocales.description', { scope: 'home.intl' }),
    },
    {
      name: 'Intl.supportedValuesOf',
      value: supportedValuesSample('calendar'),
      description: translator.t('supportedValuesOf.description', { scope: 'home.intl' }),
    },
  ]
}

function formatDuration(locale: string): string {
  let DurationFormat = (
    Intl as typeof Intl & {
      DurationFormat?: new (
        locales?: string | string[],
        options?: { style?: 'long' | 'short' | 'narrow' | 'digital' },
      ) => { format(duration: { hours: number; minutes: number }): string }
    }
  ).DurationFormat

  if (DurationFormat === undefined) return 'Not supported by this runtime'

  return new DurationFormat(locale, { style: 'long' }).format({ hours: 1, minutes: 30 })
}

function supportedValuesSample(
  key: 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit',
): string {
  if (typeof Intl.supportedValuesOf !== 'function') return 'Not supported by this runtime'

  return Intl.supportedValuesOf(key).slice(0, 3).join(', ')
}
