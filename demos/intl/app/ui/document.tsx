import type { Handle, RemixNode } from 'remix/ui'

import { localeOptions } from '../data/intl.ts'
import * as styles from './styles.ts'

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
        <body mix={[styles.pageReset, styles.page]}>
          <header mix={styles.header}>
            <div mix={styles.headerInner}>
              <a href="/" mix={styles.homeLink}>
                {title}
              </a>
              <form method="get" mix={styles.languageForm}>
                <label htmlFor="locale" mix={styles.languageLabel}>
                  {languageLabel}
                </label>
                <select id="locale" name="locale" mix={styles.languageSelect}>
                  {localeOptions.map((option) => (
                    <option value={option.locale} selected={option.locale === locale}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <button type="submit" mix={styles.languageButton}>
                  {languageSubmit}
                </button>
              </form>
            </div>
          </header>
          <main mix={styles.main}>{children}</main>
        </body>
      </html>
    )
  }
}
