import { createController } from 'remix/fetch-router'
import { Locale, Translator } from 'remix/intl'
import { Renderer } from 'remix/render-middleware'
import type { Handle } from 'remix/ui'

import { localeNames } from '../data/intl.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { Panel } from '../ui/panel.tsx'

export default createController(routes, {
  actions: {
    home({ get }) {
      let render = get(Renderer)
      let translator = get(Translator)
      let locale = get(Locale)
      let common = translator.namespace('common')
      let home = translator.namespace('home')
      let intl = translator.intl
      let collator = intl.collator()
      let intlExamples: IntlExample[] = [
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

      return render(
        <Document
          title={common.t('app.title')}
          locale={locale}
          languageLabel={common.t('language.label')}
          languageSubmit={common.t('language.submit')}
        >
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.6fr)',
              gap: 20,
              alignItems: 'start',
              marginBottom: 20,
            }}
          >
            <div>
              <p style={{ margin: '0 0 10px', color: '#52616b', fontWeight: 700 }}>
                {common.t('nav.home')}
              </p>
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>
                {home.t('hero.title')}
              </h1>
              <p style={{ maxWidth: 720, color: '#52616b', fontSize: 18, lineHeight: 1.55 }}>
                {home.t('hero.copy')}
              </p>
            </div>

            <div
              style={{
                border: '1px solid #d8d4c8',
                borderRadius: 8,
                background: '#fff',
                padding: 16,
              }}
            >
              <MetadataRow label={common.t('badge.locale')} value={localeNames[locale]} />
              <MetadataRow
                label={common.t('badge.fallbacks')}
                value={translator.fallbackChain.join(' -> ')}
              />
            </div>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 16,
              alignItems: 'stretch',
            }}
          >
            <Panel title={common.t('section.ssr')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{home.t('ssr.copy')}</p>
              <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                <dt style={{ color: '#52616b' }}>{common.t('button.save')}</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{common.t('button.save')}</dd>
                <dt style={{ color: '#52616b' }}>Checkout</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{home.t('checkout.label')}</dd>
              </dl>
            </Panel>

            <Panel title={common.t('section.namespaces')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>
                {home.t('namespaces.copy')}
              </p>
              <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                <dt style={{ color: '#52616b' }}>common</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{common.t('button.save')}</dd>
                <dt style={{ color: '#52616b' }}>home</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{home.t('hero.title')}</dd>
              </dl>
            </Panel>

            <Panel title={common.t('section.intl')} wide>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{home.t('intl.copy')}</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 12,
                }}
              >
                {intlExamples.map((example) => (
                  <IntlExampleCard example={example} />
                ))}
              </div>
            </Panel>
          </div>
        </Document>,
      )
    },
  },
})

type IntlExample = {
  name: string
  value: string
  description: string
}

function IntlExampleCard(handle: Handle<{ example: IntlExample }>) {
  return () => (
    <article
      style={{
        border: '1px solid #e5e1d6',
        borderRadius: 8,
        background: '#fbfaf7',
        padding: 12,
      }}
    >
      <h3 style={{ margin: '0 0 6px', fontSize: 14 }}>{handle.props.example.name}</h3>
      <p style={{ margin: '0 0 8px', color: '#52616b', fontSize: 13, lineHeight: 1.35 }}>
        {handle.props.example.description}
      </p>
      <code
        style={{
          display: 'block',
          borderRadius: 6,
          background: '#172026',
          color: '#fff',
          padding: '8px 10px',
          fontSize: 13,
          overflowWrap: 'anywhere',
        }}
      >
        {handle.props.example.value}
      </code>
    </article>
  )
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

function supportedValuesSample(key: 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit'): string {
  if (typeof Intl.supportedValuesOf !== 'function') return 'Not supported by this runtime'

  return Intl.supportedValuesOf(key).slice(0, 3).join(', ')
}

function MetadataRow(handle: Handle<{ label: string; value: string }>) {
  return () => (
    <p style={{ margin: '0 0 10px' }}>
      <span style={{ display: 'block', color: '#52616b', fontSize: 13 }}>{handle.props.label}</span>
      <strong>{handle.props.value}</strong>
    </p>
  )
}
