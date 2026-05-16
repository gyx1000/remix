import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'

import { number } from './intl.ts'
import { createLocaleFallbacks, createTranslator, type IntlCatalogs } from './translator.ts'

const catalogs: IntlCatalogs = {
  en: {
    button: {
      save: 'Save',
    },
    checkout: {
      title: 'Checkout',
      pay_now: 'Pay now',
      actions: {
        pay_now: 'Pay now',
      },
    },
    cart: {
      items: {
        one: '%{count} item',
        other: '%{count} items',
      },
    },
    greeting({ values }) {
      return values.title === 'mrs' ? `Hello Mrs. ${values.name}` : `Hello Mr. ${values.name}`
    },
  },
  fr: {
    button: {
      save: 'Enregistrer',
    },
    cart: {
      items: {
        one: '%{count} article',
        other: '%{count} articles',
      },
    },
  },
  'fr-CH': {
    checkout: {
      title: 'Commande',
      pay_now: 'Payer maintenant',
      actions: {
        pay_now: 'Payer maintenant',
      },
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

    assert.equal(translator.t('checkout.title'), 'Commande')
    assert.equal(translator.t('button.save'), 'Enregistrer')
    assert.equal(translator.t('checkout.pay_now'), 'Payer maintenant')
  })

  it('aliases translate to t', () => {
    let translator = createTranslator({
      locale: 'fr',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.translate('button.save'), 'Enregistrer')
  })

  it('creates scoped translator helpers', () => {
    let translator = createTranslator({
      locale: 'fr-CH',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.scope('checkout').t('pay_now'), 'Payer maintenant')
    assert.equal(translator.scope('checkout').translate('title'), 'Commande')
    assert.equal(translator.s('checkout').t('pay_now'), 'Payer maintenant')
  })

  it('passes message options through scoped translator helpers', () => {
    let translator = createTranslator({
      locale: 'fr-CH',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.scope('cart').t('items', { count: 3 }), '3 articles')
  })

  it('formats plural messages with interpolation', () => {
    let translator = createTranslator({
      locale: 'fr',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.t('cart.items', { count: 1 }), '1 article')
    assert.equal(translator.t('cart.items', { count: 3 }), '3 articles')
  })

  it('resolves function messages with count and values', () => {
    let translator = createTranslator({
      locale: 'en',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(
      translator.t('greeting', {
        values: {
          title: 'mrs',
          name: 'Ada',
        },
      }),
      'Hello Mrs. Ada',
    )
  })

  it('passes counts to function messages', () => {
    let translator = createTranslator({
      locale: 'en',
      defaultLocale: 'en',
      catalogs: {
        en: {
          inbox({ count }) {
            return count === 1 ? 'You have one message' : `You have ${count ?? 0} messages`
          },
        },
      },
    })

    assert.equal(translator.t('inbox', { count: 1 }), 'You have one message')
    assert.equal(translator.t('inbox', { count: 3 }), 'You have 3 messages')
  })

  it('prefers explicit zero messages when count is zero', () => {
    let translator = createTranslator({
      locale: 'en',
      defaultLocale: 'en',
      catalogs: {
        en: {
          inbox: {
            unread: {
              zero: 'No unread messages',
              one: '%{count} unread message',
              other: '%{count} unread messages',
            },
          },
        },
      },
    })

    assert.equal(translator.t('inbox.unread', { count: 0 }), 'No unread messages')
    assert.equal(translator.t('inbox.unread', { count: 1 }), '1 unread message')
    assert.equal(translator.t('inbox.unread', { count: 5 }), '5 unread messages')
  })

  it('falls back to the key or default value for missing messages', () => {
    let translator = createTranslator({
      locale: 'en',
      defaultLocale: 'en',
      catalogs,
    })

    assert.equal(translator.t('missing.key'), 'missing.key')
    assert.equal(translator.t('missing.key', { defaultValue: 'Fallback' }), 'Fallback')
  })

  it('formats tagged Intl values during interpolation', () => {
    let translator = createTranslator({
      locale: 'en-US',
      defaultLocale: 'en-US',
      catalogs: {
        'en-US': {
          checkout: {
            total: 'Total: %{amount}',
          },
        },
      },
    })

    assert.equal(
      translator.t('checkout.total', {
        values: { amount: number(1234.5, { style: 'currency', currency: 'USD' }) },
      }),
      'Total: $1,234.50',
    )
  })

  it('localizes date and time values', () => {
    let translator = createTranslator({
      locale: 'en-US',
      defaultLocale: 'en-US',
      catalogs,
    })

    assert.equal(
      translator.l(new Date('2026-05-14T10:30:00Z'), { timeZone: 'UTC', dateStyle: 'medium' }),
      'May 14, 2026',
    )
  })

  it('exposes the resolved fallback chain and Intl formatter facade', () => {
    let translator = createTranslator({
      locale: 'fr-CH',
      defaultLocale: 'en',
      catalogs,
    })

    assert.deepEqual(translator.fallbackChain, ['fr-CH', 'fr', 'en'])
    assert.equal(translator.intl.locale, 'fr-CH')
  })
})
