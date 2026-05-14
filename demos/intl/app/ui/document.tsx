import type { Handle, RemixNode } from 'remix/ui'

import { localeNames, supportedLocales } from '../data/intl.ts'

type DocumentProps = {
  title: string
  locale: string
  languageLabel: string
  languageSubmit: string
  children?: RemixNode
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { title, locale, languageLabel, languageSubmit, children } = handle.props

    return (
      <html lang={locale}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
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
              <form method="get" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label htmlFor="locale" style={{ fontSize: 14, color: '#52616b' }}>
                  {languageLabel}
                </label>
                <select
                  id="locale"
                  name="locale"
                  style={{
                    border: '1px solid #b9b2a2',
                    borderRadius: 6,
                    padding: '7px 28px 7px 9px',
                    background: '#fff',
                    color: '#172026',
                  }}
                >
                  {supportedLocales.map((supportedLocale) => (
                    <option value={supportedLocale} selected={supportedLocale === locale}>
                      {localeNames[supportedLocale]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  style={{
                    border: '1px solid #1d4f91',
                    borderRadius: 6,
                    background: '#1d4f91',
                    color: '#fff',
                    padding: '8px 12px',
                    fontWeight: 600,
                  }}
                >
                  {languageSubmit}
                </button>
              </form>
            </div>
          </header>
          <main style={{ maxWidth: 1080, margin: '0 auto', padding: 24 }}>{children}</main>
        </body>
      </html>
    )
  }
}
