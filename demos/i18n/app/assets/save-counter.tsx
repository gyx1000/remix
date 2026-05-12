import type { I18nClientState } from 'remix/i18n'
import { I18nProvider } from 'remix/i18n/ui'
import { getTranslator } from 'remix/i18n/ui'
import { clientEntry, on, type Handle } from 'remix/ui'

export const SaveCounter = clientEntry(
  '/assets/save-counter.js#SaveCounter',
  function SaveCounter(handle: Handle<{ clientState: I18nClientState; initialCount: number }>) {
    return () => (
      <I18nProvider state={handle.props.clientState}>
        <SaveCounterControl initialCount={handle.props.initialCount} />
      </I18nProvider>
    )
  },
)

function SaveCounterControl(handle: Handle<{ initialCount: number }>) {
  let t = getTranslator(handle, 'common')
  let count = handle.props.initialCount

  return () => (
    <div>
      <p style={{ marginTop: 0, color: '#52616b' }}>{t.gettext('counter.label')}</p>
      <p style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>
        {t.ngettext('counter.count', 'counter.count', count)}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          mix={[
            on('click', () => {
              count += 1
              handle.update()
            }),
          ]}
          style={{
            border: '1px solid #1d4f91',
            borderRadius: 6,
            background: '#1d4f91',
            color: '#fff',
            padding: '8px 12px',
            fontWeight: 600,
          }}
        >
          {t.gettext('button.save')}
        </button>
        <button
          type="button"
          mix={[
            on('click', () => {
              count = 0
              handle.update()
            }),
          ]}
          style={{
            border: '1px solid #b9b2a2',
            borderRadius: 6,
            background: '#fff',
            color: '#172026',
            padding: '8px 12px',
            fontWeight: 600,
          }}
        >
          {t.gettext('button.clear')}
        </button>
      </div>
    </div>
  )
}
