import type { I18nClientState } from 'remix/i18n'
import { I18nProvider } from 'remix/i18n/ui'
import { getTranslator } from 'remix/i18n/ui'
import { clientEntry, on, type Handle } from 'remix/ui'

export const FrameWidget = clientEntry(
  '/assets/frame-widget.js#FrameWidget',
  function FrameWidget(handle: Handle<{ clientState: I18nClientState; initialCount: number }>) {
    return () => (
      <I18nProvider state={handle.props.clientState}>
        <FrameWidgetControl initialCount={handle.props.initialCount} />
      </I18nProvider>
    )
  },
)

function FrameWidgetControl(handle: Handle<{ initialCount: number }>) {
  let t = getTranslator(handle, 'common')
  let count = handle.props.initialCount

  return () => (
    <button
      type="button"
      mix={[
        on('click', () => {
          count += 1
          handle.update()
        }),
      ]}
      style={{
        border: '1px solid #b76e00',
        borderRadius: 6,
        background: '#fff7e6',
        color: '#6f4200',
        padding: '8px 12px',
        fontWeight: 700,
      }}
    >
      {t.ngettext('counter.count', 'counter.count', count)}
    </button>
  )
}
