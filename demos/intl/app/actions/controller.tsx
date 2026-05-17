import { createController } from 'remix/fetch-router'
import { Locale, Translator } from 'remix/intl'
import { Renderer } from 'remix/render-middleware'
import type { Handle } from 'remix/ui'

import { localeOptions } from '../data/intl.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { Panel } from '../ui/panel.tsx'
import * as styles from '../ui/styles.ts'
import { getIntlExamples, type IntlExample } from './intl-examples.ts'

export default createController(routes, {
  actions: {
    home({ get }) {
      let render = get(Renderer)
      let translator = get(Translator)
      let locale = get(Locale)
      let intl = translator.intl
      let checkout = translator.scope('checkout')
      let pluralMessages = translator.scope('home.pluralMessages')
      let intlExamples = getIntlExamples({ intl, locale, translator })
      let localeName = localeOptions.find((option) => option.locale === locale)?.name ?? locale

      return render(
        <Document
          title={translator.t('app.title')}
          locale={locale}
          languageLabel={translator.t('language.label')}
          languageSubmit={translator.t('language.submit')}
        >
          <section mix={styles.hero}>
            <div>
              <p mix={styles.eyebrow}>{translator.t('nav.home')}</p>
              <h1 mix={styles.heroTitle}>{translator.t('home.hero.title')}</h1>
              <p mix={styles.heroCopy}>{translator.t('home.hero.copy')}</p>
            </div>

            <div mix={styles.metadataPanel}>
              <MetadataRow label={translator.t('badge.locale')} value={localeName} />
              <MetadataRow
                label={translator.t('badge.fallbacks')}
                value={translator.fallbackChain.join(' -> ')}
              />
            </div>
          </section>

          <div mix={styles.contentGrid}>
            <Panel title={translator.t('section.ssr')}>
              <p mix={styles.bodyCopy}>{translator.t('home.ssr.copy')}</p>
              <dl mix={styles.definitionList}>
                <dt mix={styles.definitionTerm}>home.checkout.title</dt>
                <dd mix={styles.definitionValue}>{translator.t('home.checkout.title')}</dd>
                <dt mix={styles.definitionTerm}>account.settings.save</dt>
                <dd mix={styles.definitionValue}>{translator.t('account.settings.save')}</dd>
              </dl>
            </Panel>

            <Panel title={translator.t('section.scopes')}>
              <p mix={styles.bodyCopy}>{translator.t('home.scopes.copy')}</p>
              <dl mix={styles.definitionList}>
                <dt mix={styles.definitionTerm}>checkout.actions.confirm</dt>
                <dd mix={styles.definitionValue}>{checkout.t('actions.confirm')}</dd>
                <dt mix={styles.definitionTerm}>checkout.summary.total</dt>
                <dd mix={styles.definitionValue}>{checkout.t('summary.total')}</dd>
              </dl>
            </Panel>

            <PluralMessagesCard
              title={translator.t('section.pluralMessages')}
              description={pluralMessages.t('description')}
              values={[0, 1, 5].map((count) => pluralMessages.t('value', { count }))}
            />

            <Panel title={translator.t('section.intl')} wide>
              <p mix={styles.bodyCopy}>{translator.t('home.intl.copy')}</p>
              <div mix={styles.examplesGrid}>
                {intlExamples.map((example) => (
                  <IntlExampleCard example={example} />
                ))}
              </div>
            </Panel>
          </div>
        </Document>,
      )
    },
  },
})

function IntlExampleCard(handle: Handle<{ example: IntlExample }>) {
  return () => (
    <article mix={styles.exampleCard}>
      <h3 mix={styles.exampleTitle}>{handle.props.example.name}</h3>
      <p mix={styles.exampleDescription}>{handle.props.example.description}</p>
      <code mix={styles.codeBlock}>{handle.props.example.value}</code>
    </article>
  )
}

function PluralMessagesCard(
  handle: Handle<{ title: string; description: string; values: string[] }>,
) {
  return () => (
    <section mix={[styles.panel, styles.panelWide, styles.compactPanel]}>
      <h2 mix={styles.compactPanelTitle}>{handle.props.title}</h2>
      <p mix={styles.compactCopy}>{handle.props.description}</p>
      <div mix={styles.codeList}>
        {handle.props.values.map((value) => (
          <code mix={styles.codeBlock}>{value}</code>
        ))}
      </div>
    </section>
  )
}

function MetadataRow(handle: Handle<{ label: string; value: string }>) {
  return () => (
    <p mix={styles.metadataRow}>
      <span mix={styles.metadataLabel}>{handle.props.label}</span>
      <strong>{handle.props.value}</strong>
    </p>
  )
}
