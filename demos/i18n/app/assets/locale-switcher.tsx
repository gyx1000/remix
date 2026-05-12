import type { I18nClientState } from 'remix/i18n'
import { I18nProvider } from 'remix/i18n/ui'
import { getTranslator } from 'remix/i18n/ui'
import { clientEntry, on, type Handle } from 'remix/ui'

import { localeNames, supportedLocales } from '../data/i18n.ts'

export const LocaleSwitcher = clientEntry(
  '/assets/locale-switcher.js#LocaleSwitcher',
  function LocaleSwitcher(handle: Handle<{ clientState: I18nClientState; locale: string }>) {
    return () => (
      <I18nProvider state={handle.props.clientState}>
        <LocaleSwitcherControl locale={handle.props.locale} />
      </I18nProvider>
    )
  },
)

function LocaleSwitcherControl(handle: Handle<{ locale: string }>) {
  let t = getTranslator(handle, 'common')

  return () => (
    <form method="get" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="locale" style={{ fontSize: 14, color: '#52616b' }}>
        {t.gettext('language.label')}
      </label>
      <select
        id="locale"
        name="locale"
        mix={[
          on('change', (event) => {
            let select = event.currentTarget
            if (!(select instanceof HTMLSelectElement)) return
            select.form?.requestSubmit()
          }),
        ]}
        style={{
          border: '1px solid #b9b2a2',
          borderRadius: 6,
          padding: '7px 28px 7px 9px',
          background: '#fff',
          color: '#172026',
        }}
      >
        {supportedLocales.map((locale) => (
          <option value={locale} selected={locale === handle.props.locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </form>
  )
}
