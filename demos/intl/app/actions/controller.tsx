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
      let intl = translator.intl
      let checkout = translator.scope('checkout')
      let pluralMessages = translator.scope('home.pluralMessages')
      let intlExamples = getIntlExamples({ intl, locale, translator })

      return render(
        <Document
          title={translator.t('app.title')}
          locale={locale}
          languageLabel={translator.t('language.label')}
          languageSubmit={translator.t('language.submit')}
        >
          <section className="intl-hero">
            <div>
              <p style={{ margin: '0 0 10px', color: '#52616b', fontWeight: 700 }}>
                {translator.t('nav.home')}
              </p>
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>
                {translator.t('home.hero.title')}
              </h1>
              <p style={{ maxWidth: 720, color: '#52616b', fontSize: 18, lineHeight: 1.55 }}>
                {translator.t('home.hero.copy')}
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
              <MetadataRow label={translator.t('badge.locale')} value={localeNames[locale]} />
              <MetadataRow
                label={translator.t('badge.fallbacks')}
                value={translator.fallbackChain.join(' -> ')}
              />
            </div>
          </section>

          <div className="intl-content-grid">
            <Panel title={translator.t('section.ssr')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{translator.t('home.ssr.copy')}</p>
              <dl className="intl-definition-list">
                <dt style={{ color: '#52616b' }}>home.checkout.title</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>
                  {translator.t('home.checkout.title')}
                </dd>
                <dt style={{ color: '#52616b' }}>account.settings.save</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>
                  {translator.t('account.settings.save')}
                </dd>
              </dl>
            </Panel>

            <Panel title={translator.t('section.scopes')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>
                {translator.t('home.scopes.copy')}
              </p>
              <dl className="intl-definition-list">
                <dt style={{ color: '#52616b' }}>checkout.actions.confirm</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>
                  {checkout.t('actions.confirm')}
                </dd>
                <dt style={{ color: '#52616b' }}>checkout.summary.total</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{checkout.t('summary.total')}</dd>
              </dl>
            </Panel>

            <PluralMessagesCard
              title={translator.t('section.pluralMessages')}
              description={pluralMessages.t('description')}
              values={[0, 1, 5].map((count) => pluralMessages.t('value', { count }))}
            />

            <Panel title={translator.t('section.intl')} wide>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{translator.t('home.intl.copy')}</p>
              <div className="intl-examples-grid">
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
