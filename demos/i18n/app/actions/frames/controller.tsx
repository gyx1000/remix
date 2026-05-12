import { createController } from 'remix/fetch-router'
import { Locale, Translator } from 'remix/i18n'
import { I18nProvider } from 'remix/i18n/ui'
import { Renderer } from 'remix/render-middleware'

import { FrameWidget } from '../../assets/frame-widget.tsx'
import { withLocale } from '../../data/i18n.ts'
import { routes } from '../../routes.ts'

const namespaces = ['common', 'frame'] as const

export const framesController = createController(routes.frames, {
  actions: {
    inventory({ get }) {
      let render = get(Renderer)
      let translator = get(Translator)
      let locale = get(Locale)
      let common = translator.namespace('common')
      let frame = translator.namespace('frame')
      let commonClientState = translator.clientState({ namespaces: ['common'] })
      let timestamp = new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date())

      return render(
        <I18nProvider state={translator.clientState({ namespaces })}>
          <div
            style={{
              border: '1px solid #eed8aa',
              borderRadius: 8,
              background: '#fffbf2',
              padding: 14,
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{frame.gettext('title')}</h3>
            <p style={{ marginTop: 0, color: '#6a5a3c', lineHeight: 1.5 }}>
              {frame.gettext('copy')}
            </p>
            <p style={{ color: '#6a5a3c', fontWeight: 700 }}>
              {frame.gettext('status', { values: { time: timestamp } })}
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <FrameWidget clientState={commonClientState} initialCount={2} />
              <a
                href={withLocale(routes.frames.inventory.href(), locale)}
                rmx-target="inventory"
                style={{
                  color: '#6f4200',
                  fontWeight: 700,
                }}
              >
                {common.gettext('frame.reload')}
              </a>
            </div>
          </div>
        </I18nProvider>,
      )
    },
  },
})
