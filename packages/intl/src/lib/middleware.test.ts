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

  it('preserves a resolved regional locale', async () => {
    let context = new RequestContext(new Request('https://example.com/'))
    let middleware = intl({
      defaultLocale: 'en',
      catalogs: {
        en: {},
        fr: {},
      },
      getLocale() {
        return 'fr-CA'
      },
    })

    await middleware(context, async () => new Response())

    let translator = context.get(Translator)
    assert.equal(context.get(Locale), 'fr-CA')
    assert.equal(translator?.locale, 'fr-CA')
    assert.equal(translator?.intl.locale, 'fr-CA')
  })

  it('falls back to Accept-Language negotiation with catalog locales', async () => {
    let context = new RequestContext(
      new Request('https://example.com/', {
        headers: { 'Accept-Language': 'fr-CA, en;q=0.5' },
      }),
    )
    let middleware = intl({
      defaultLocale: 'en',
      catalogs: {
        en: {},
        fr: {},
      },
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'fr-CA')
  })

  it('falls back to the default locale when a resolved locale is invalid', async () => {
    let context = new RequestContext(new Request('https://example.com/'))
    let middleware = intl({
      defaultLocale: 'en',
      catalogs: { en: {} },
      getLocale() {
        return 'not a locale'
      },
    })

    await middleware(context, async () => new Response())

    assert.equal(context.get(Locale), 'en')
  })
})
