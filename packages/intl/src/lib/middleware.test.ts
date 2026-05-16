import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'
import { RequestContext } from '@remix-run/fetch-router'

import { Locale, Translator, intl } from './middleware.ts'

describe('intl', () => {
  it('uses a custom locale resolver when provided', async () => {
    let context = new RequestContext(
      new Request('https://example.com/', {
        headers: { 'Accept-Language': 'en' },
      }),
    )
    let middleware = intl({
      supportedLocales: ['en', 'fr'],
      defaultLocale: 'en',
      catalogs: {
        fr: {
          button: {
            save: 'Enregistrer',
          },
        },
      },
      getLocale() {
        return 'fr'
      },
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr')
    assert.equal(context.get(Translator)?.t('button.save'), 'Enregistrer')
  })

  it('falls back to Accept-Language negotiation', async () => {
    let context = new RequestContext(
      new Request('https://example.com/', {
        headers: { 'Accept-Language': 'de, fr-CH;q=0.9, en;q=0.5' },
      }),
    )
    let middleware = intl({
      supportedLocales: ['en', 'fr-CH'],
      defaultLocale: 'en',
      catalogs: {},
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr-CH')
  })

})
