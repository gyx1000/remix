import { createController } from 'remix/fetch-router'
import { Locale, Translator } from 'remix/i18n'
import { Renderer } from 'remix/render-middleware'
import { Frame, type Handle } from 'remix/ui'

import { SaveCounter } from '../assets/save-counter.tsx'
import { localeNames, withLocale } from '../data/i18n.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { Panel } from '../ui/panel.tsx'

const namespaces = ['common', 'home'] as const

export default createController(routes, {
  actions: {
    home({ get }) {
      let render = get(Renderer)
      let translator = get(Translator)
      let locale = get(Locale)
      let common = translator.namespace('common')
      let home = translator.namespace('home')
      let clientState = translator.clientState({ namespaces })
      let commonClientState = translator.clientState({ namespaces: ['common'] })
      let frameSrc = withLocale(routes.frames.inventory.href(), locale)

      return render(
        <Document title={common.gettext('app.title')} locale={locale} clientState={clientState}>
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
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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

            <Panel title={common.gettext('section.hydration')}>
              <SaveCounter clientState={commonClientState} initialCount={1} />
              <p style={{ color: '#52616b', lineHeight: 1.5 }}>{home.gettext('payload.copy')}</p>
            </Panel>

            <Panel title={common.gettext('section.frame')}>
              <Frame
                name="inventory"
                src={frameSrc}
                fallback={<p style={{ color: '#52616b' }}>Loading…</p>}
              />
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
