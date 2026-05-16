import type { Handle, RemixNode } from 'remix/ui'

import { localeOptions } from '../data/intl.ts'

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
          <style>{styles}</style>
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
              className="intl-header"
              style={{
                maxWidth: 1080,
                margin: '0 auto',
              }}
            >
              <a href="/" style={{ color: '#172026', fontWeight: 700, textDecoration: 'none' }}>
                {title}
              </a>
              <form method="get" className="intl-language-form">
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
                  {localeOptions.map((option) => (
                    <option value={option.locale} selected={option.locale === locale}>
                      {option.name}
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
          <main className="intl-main" style={{ maxWidth: 1080, margin: '0 auto' }}>
            {children}
          </main>
        </body>
      </html>
    )
  }
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .intl-header {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    padding: 18px 24px;
  }

  .intl-language-form {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .intl-main {
    padding: 24px;
  }

  .intl-hero {
    align-items: start;
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
    margin-bottom: 20px;
  }

  .intl-content-grid {
    align-items: stretch;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .intl-examples-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .intl-definition-list {
    display: grid;
    gap: 8px;
    grid-template-columns: 120px 1fr;
  }

  @media (max-width: 760px) {
    .intl-header {
      align-items: stretch;
      flex-direction: column;
      padding: 16px;
    }

    .intl-language-form {
      align-items: stretch;
      display: grid;
      grid-template-columns: 1fr;
    }

    .intl-language-form select,
    .intl-language-form button {
      width: 100%;
    }

    .intl-main {
      padding: 16px;
    }

    .intl-hero,
    .intl-content-grid,
    .intl-examples-grid {
      grid-template-columns: 1fr;
    }

    .intl-hero h1 {
      font-size: 34px !important;
      line-height: 1.1 !important;
    }
  }

  @media (max-width: 430px) {
    .intl-main {
      padding: 12px;
    }

    .intl-definition-list {
      grid-template-columns: 1fr;
    }

    .intl-definition-list dd {
      overflow-wrap: anywhere;
    }

    .intl-hero h1 {
      font-size: 30px !important;
    }
  }
`
