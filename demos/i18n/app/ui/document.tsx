import type { I18nClientState } from 'remix/i18n'
import { I18nProvider } from 'remix/i18n/ui'
import type { Handle, RemixNode } from 'remix/ui'

import { LocaleSwitcher } from '../assets/locale-switcher.tsx'

type DocumentProps = {
  title: string
  locale: string
  clientState: I18nClientState
  children?: RemixNode
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { title, locale, clientState, children } = handle.props

    return (
      <html lang={locale}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <script async type="module" src="/assets/entry.js" />
        </head>
        <body
          style={{
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            margin: 0,
            background: '#f7f5ef',
            color: '#172026',
          }}
        >
          <I18nProvider state={clientState}>
            <header
              style={{
                borderBottom: '1px solid #d8d4c8',
                background: '#ffffff',
              }}
            >
              <div
                style={{
                  maxWidth: 1080,
                  margin: '0 auto',
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <a href="/" style={{ color: '#172026', fontWeight: 700, textDecoration: 'none' }}>
                  {title}
                </a>
                <LocaleSwitcher clientState={clientState} locale={locale} />
              </div>
            </header>
            <main style={{ maxWidth: 1080, margin: '0 auto', padding: 24 }}>{children}</main>
          </I18nProvider>
        </body>
      </html>
    )
  }
}
