import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'
import { RequestContext } from '@remix-run/fetch-router'

import { Locale, Translator, i18n } from './middleware.ts'

describe('i18n', () => {
  it('uses a custom locale resolver when provided', async () => {
    let context = new RequestContext(
      new Request('https://example.com/', {
        headers: { 'Accept-Language': 'en' },
      }),
    )
    let middleware = i18n({
      supportedLocales: ['en', 'fr'],
      defaultLocale: 'en',
      catalogs: {
        fr: {
          common: {
            Save: 'Enregistrer',
          },
        },
      },
      getLocale() {
        return 'fr'
      },
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr')
    assert.equal(context.get(Translator)?.gettext('Save'), 'Enregistrer')
  })

  it('falls back to Accept-Language negotiation', async () => {
    let context = new RequestContext(
      new Request('https://example.com/', {
        headers: { 'Accept-Language': 'de, fr-CH;q=0.9, en;q=0.5' },
      }),
    )
    let middleware = i18n({
      supportedLocales: ['en', 'fr-CH'],
      defaultLocale: 'en',
      catalogs: {},
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr-CH')
  })

  it('uses route params before Accept-Language when available', async () => {
    let context = new RequestContext(
      new Request('https://example.com/fr/', {
        headers: { 'Accept-Language': 'en' },
      }),
    )
    context.params = { locale: 'fr' }
    let middleware = i18n({
      supportedLocales: ['en', 'fr'],
      defaultLocale: 'en',
      catalogs: {},
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr')
  })
})
