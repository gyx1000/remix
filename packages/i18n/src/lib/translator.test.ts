import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'

import { gettextLazy, ngettextLazy, pgettextLazy } from './lazy-message.ts'
import { createLocaleFallbacks, createTranslator, type I18nCatalogs } from './translator.ts'

const catalogs: I18nCatalogs = {
  en: {
    common: {
      Save: 'Save',
      Checkout: 'Checkout',
      'cart.items': {
        one: '%{count} item',
        other: '%{count} items',
      },
      'button\u0004Archive': 'Archive',
    },
    checkout: {
      'Pay now': 'Pay now',
    },
  },
  fr: {
    common: {
      Save: 'Enregistrer',
      'cart.items': {
        one: '%{count} article',
        other: '%{count} articles',
      },
      'button\u0004Archive': 'Archiver',
    },
  },
  'fr-CH': {
    common: {
      Checkout: 'Commande',
    },
    checkout: {
      'Pay now': 'Payer maintenant',
    },
  },
}

describe('createLocaleFallbacks', () => {
  it('creates a locale fallback chain from specific to default locale', () => {
    assert.deepEqual(createLocaleFallbacks('fr-CH', 'en'), ['fr-CH', 'fr', 'en'])
  })

  it('does not duplicate the default locale', () => {
    assert.deepEqual(createLocaleFallbacks('en-US', 'en'), ['en-US', 'en'])
  })
})

describe('createTranslator', () => {
  it('resolves messages through the fallback chain', () => {
    let translator = createTranslator({
      locale: 'fr-CH',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.gettext('Checkout'), 'Commande')
    assert.equal(translator.gettext('Save'), 'Enregistrer')
    assert.equal(translator.namespace('checkout').gettext('Pay now'), 'Payer maintenant')
  })

  it('formats plural messages with interpolation', () => {
    let translator = createTranslator({
      locale: 'fr',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.ngettext('cart.items', 'cart.items', 1), '1 article')
    assert.equal(translator.ngettext('cart.items', 'cart.items', 3), '3 articles')
  })

  it('uses gettext fallbacks for missing plural messages', () => {
    let translator = createTranslator({
      locale: 'en',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.ngettext('%{count} file', '%{count} files', 1), '1 file')
    assert.equal(translator.ngettext('%{count} file', '%{count} files', 2), '2 files')
  })

  it('resolves contextual and lazy messages', () => {
    let translator = createTranslator({
      locale: 'fr',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.pgettext('button', 'Archive'), 'Archiver')
    assert.equal(translator.resolve(gettextLazy('Save')), 'Enregistrer')
    assert.equal(translator.resolve(pgettextLazy('button', 'Archive')), 'Archiver')
    assert.equal(translator.resolve(ngettextLazy('cart.items', 'cart.items', 2)), '2 articles')
  })

  it('creates flattened client state for requested namespaces', () => {
    let translator = createTranslator({
      locale: 'fr-CH',
      defaultLocale: 'en',
      catalogs,
    })

    assert.deepEqual(translator.clientState({ namespaces: ['common'] }), {
      locale: 'fr-CH',
      fallbackChain: ['fr-CH', 'fr', 'en'],
      namespaces: {
        common: {
          Save: 'Enregistrer',
          Checkout: 'Commande',
          'cart.items': {
            one: '%{count} article',
            other: '%{count} articles',
          },
          'button\u0004Archive': 'Archiver',
        },
      },
    })
  })
})
