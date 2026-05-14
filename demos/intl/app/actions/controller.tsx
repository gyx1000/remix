import { createController } from 'remix/fetch-router'
import { Locale, Translator } from 'remix/intl'
import { Renderer } from 'remix/render-middleware'
import type { Handle } from 'remix/ui'

import { localeNames } from '../data/intl.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { Panel } from '../ui/panel.tsx'
import { getIntlExamples, type IntlExample } from './intl-examples.ts'

export default createController(routes, {
  actions: {
    home({ get }) {
      let render = get(Renderer)
      let translator = get(Translator)
      let locale = get(Locale)
      let common = translator.namespace('common')
      let home = translator.namespace('home')
      let intl = translator.intl
      let intlExamples = getIntlExamples({ intl, locale, messages: home })

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
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>{home.t('hero.title')}</h1>
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
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{home.t('namespaces.copy')}</p>
              <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                <dt style={{ color: '#52616b' }}>common</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{common.t('button.save')}</dd>
                <dt style={{ color: '#52616b' }}>home</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{home.t('hero.title')}</dd>
              </dl>
            </Panel>

            <PluralMessagesCard
              title={common.t('section.pluralMessages')}
              description={home.t('pluralMessages.description')}
              values={[1, 5].map((count) => home.t('pluralMessages.value', { count }))}
            />

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

function PluralMessagesCard(
  handle: Handle<{ title: string; description: string; values: string[] }>,
) {
  return () => (
    <section
      style={{
        border: '1px solid #d8d4c8',
        borderRadius: 8,
        background: '#fff',
        padding: 18,
        gridColumn: '1 / -1',
        maxWidth: 460,
      }}
    >
      <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{handle.props.title}</h2>
      <p style={{ margin: '0 0 12px', color: '#52616b', lineHeight: 1.45 }}>
        {handle.props.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {handle.props.values.map((value) => (
          <code
            style={{
              borderRadius: 6,
              background: '#172026',
              color: '#fff',
              padding: '8px 10px',
              fontSize: 13,
            }}
          >
            {value}
          </code>
        ))}
      </div>
    </section>
  )
}

function MetadataRow(handle: Handle<{ label: string; value: string }>) {
  return () => (
    <p style={{ margin: '0 0 10px' }}>
      <span style={{ display: 'block', color: '#52616b', fontSize: 13 }}>{handle.props.label}</span>
      <strong>{handle.props.value}</strong>
    </p>
  )
}
