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

      return render(
        <Document
          title={common.gettext('app.title')}
          locale={locale}
          languageLabel={common.gettext('language.label')}
          languageSubmit={common.gettext('language.submit')}
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
                {common.gettext('nav.home')}
              </p>
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>
                {home.gettext('hero.title')}
              </h1>
              <p style={{ maxWidth: 720, color: '#52616b', fontSize: 18, lineHeight: 1.55 }}>
                {home.gettext('hero.copy')}
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
              <MetadataRow label={common.gettext('badge.locale')} value={localeNames[locale]} />
              <MetadataRow
                label={common.gettext('badge.fallbacks')}
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
            <Panel title={common.gettext('section.ssr')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{home.gettext('ssr.copy')}</p>
              <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                <dt style={{ color: '#52616b' }}>{common.gettext('button.save')}</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{common.gettext('button.save')}</dd>
                <dt style={{ color: '#52616b' }}>Checkout</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{home.gettext('checkout.label')}</dd>
              </dl>
            </Panel>

            <Panel title={common.gettext('section.namespaces')}>
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>
                {home.gettext('namespaces.copy')}
              </p>
              <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                <dt style={{ color: '#52616b' }}>common</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{common.gettext('button.save')}</dd>
                <dt style={{ color: '#52616b' }}>home</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{home.gettext('hero.title')}</dd>
              </dl>
            </Panel>
          </div>
        </Document>,
      )
    },
  },
})

function MetadataRow(handle: Handle<{ label: string; value: string }>) {
  return () => (
    <p style={{ margin: '0 0 10px' }}>
      <span style={{ display: 'block', color: '#52616b', fontSize: 13 }}>{handle.props.label}</span>
      <strong>{handle.props.value}</strong>
    </p>
  )
}
