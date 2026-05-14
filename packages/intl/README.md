# intl

Composable Intl primitives for Remix applications. `intl` provides request-scoped locale negotiation, a cached facade over JavaScript's native `Intl` formatters, Rails-style `t()`/`translate()` message lookup, `l()`/`localize()` date-time localization, plural handling, and namespaces without a global locale.

## Features

- Request-scoped `Locale` and `Translator` context keys for backend code
- Rails-style `t()`/`translate()` message lookup with interpolation and plural messages
- Rails-style `l()`/`localize()` date-time localization
- Cached wrappers for `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.ListFormat`, `Intl.DisplayNames`, `Intl.PluralRules`, `Intl.Collator`, and `Intl.Segmenter`
- Tagged interpolation values like `number()`, `dateTime()`, `relativeTime()`, `list()`, and `displayName()`
- Locale fallback chains such as `fr-CH -> fr -> en`
- Namespace-scoped translators for route and feature catalogs

## Installation

```sh
npm i remix
```

## Usage

Create a request-scoped translator with the `intl` middleware:

```ts
import { intl, number, Translator } from 'remix/intl'

let catalogs = {
  en: {
    common: {
      Save: 'Save',
      total: 'Total: %{amount}',
      'cart.items': {
        one: '%{count} item',
        other: '%{count} items',
      },
    },
    checkout: {
      'Pay now': 'Pay now',
    },
  },
  fr: {
    common: {
      Save: 'Enregistrer',
      total: 'Total : %{amount}',
      'cart.items': {
        one: '%{count} article',
        other: '%{count} articles',
      },
    },
    checkout: {
      'Pay now': 'Payer maintenant',
    },
  },
}

router.use(
  intl({
    supportedLocales: ['en', 'fr', 'fr-CH'],
    defaultLocale: 'en',
    catalogs,
  }),
)

router.get('/checkout', (context) => {
  let t = context.get(Translator)

  return new Response(
    t.t('total', {
      values: { amount: number(1234.5, { style: 'currency', currency: 'CHF' }) },
    }),
  )
})
```

## Native Intl facade

Use `createIntl()` when you only need formatting primitives:

```ts
import { createIntl } from 'remix/intl'

let intl = createIntl(['fr-CH', 'fr', 'en'])

intl.formatNumber(1234.5, { style: 'currency', currency: 'CHF' })
intl.formatDateTime(new Date(), { dateStyle: 'long', timeStyle: 'short' })
intl.formatRelativeTime(-1, 'day', { numeric: 'auto' })
intl.formatList(['Remix', 'React', 'Vite'])
intl.formatDisplayName('CH', { type: 'region' })
intl.selectPlural(2)
intl.compare('éclair', 'zebra')
intl.segment('Hello world', { granularity: 'word' })
```

`Translator` exposes the same facade as `translator.intl`, scoped to the resolved fallback chain for the request.

## Namespaces

Namespaces split translations into page- or feature-sized catalogs:

```ts
router.get('/checkout', (context) => {
  let t = context.get(Translator).namespace('checkout')

  return new Response(t.t('Pay now'))
})
```

A `fr-CH` request can resolve messages from `fr-CH`, `fr`, and `en` while route code keeps using the same namespace translator.

## Locale Fallbacks

By default, locale fallbacks are derived from the locale tag and default locale:

```ts
createLocaleFallbacks('fr-CH', 'en')
// ['fr-CH', 'fr', 'en']
```

You can customize fallbacks:

```ts
intl({
  supportedLocales: ['en', 'fr', 'fr-CH'],
  defaultLocale: 'en',
  catalogs,
  fallbackLocales(locale) {
    if (locale === 'fr-CH') return ['fr', 'en']
    return ['en']
  },
})
```

## Localizing dates

Use `l()` or `localize()` for Rails-style date-time localization:

```ts
router.get('/today', (context) => {
  let t = context.get(Translator)

  return new Response(t.l(new Date(), { dateStyle: 'long' }))
})
```

## Changing Locales

Prefer a full document reload when the user changes language. Let the server update the locale cookie or URL segment, redirect to the current page, rerun SSR, and send fresh translated HTML.

## Related Packages

- [`fetch-router`](https://github.com/remix-run/remix/tree/main/packages/fetch-router) provides request context and middleware.
- [`headers`](https://github.com/remix-run/remix/tree/main/packages/headers) provides `Accept-Language` parsing.

## Related Work

- [Rails Internationalization API](https://guides.rubyonrails.org/i18n.html)
- [ECMAScript Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Unicode MessageFormat 2.0](https://github.com/unicode-org/message-format-wg)

## License

See [LICENSE](https://github.com/remix-run/remix/blob/main/LICENSE)
