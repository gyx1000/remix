# i18n

Composable internationalization primitives for Remix applications. `i18n` provides request-scoped locale negotiation, Rails-style translation keys, namespace-scoped client payloads, lazy messages, and UI hydration support without a global locale.

## Features

- Request-scoped `Locale` and `Translator` context keys for backend code
- Rails-style `t()` translation with interpolation and plural messages
- gettext-style `gettext`, `ngettext`, `pgettext`, and lazy message helpers
- Locale fallback chains such as `fr-CH -> fr -> en`
- Namespace-scoped client state so hydrated components only receive the messages they need
- `I18nProvider` for `remix/ui` component context

## Installation

```sh
npm i remix
```

## Usage

Create a request-scoped translator with the i18n middleware:

```ts
import { i18n, Translator } from 'remix/i18n'

let catalogs = {
  en: {
    common: {
      Save: 'Save',
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
  i18n({
    supportedLocales: ['en', 'fr', 'fr-CH'],
    defaultLocale: 'en',
    catalogs,
  }),
)

router.get('/checkout', (context) => {
  let t = context.get(Translator)

  return new Response(t.namespace('checkout').gettext('Pay now'))
})
```

## Namespaces

Namespaces split translations into page- or feature-sized catalogs. This keeps client i18n payloads small:

```ts
let clientState = context.get(Translator).clientState({
  namespaces: ['common', 'checkout'],
})
```

The client state is flattened on the server after locale fallback resolution. A `fr-CH` request can resolve messages from `fr-CH`, `fr`, and `en`, but hydrated components receive one effective catalog for each requested namespace.

## Hydrated Components

Use `I18nProvider` to bridge the request translator into the `remix/ui` component context:

```tsx
import type { Handle, RemixNode } from 'remix/ui'
import { I18nProvider, getTranslator } from 'remix/i18n/ui'

function Layout(handle: Handle<{ children?: RemixNode }>) {
  let clientState = requestContext.get(Translator).clientState({
    namespaces: ['common'],
  })

  return () => (
    <html>
      <body>
        <I18nProvider state={clientState}>{handle.props.children}</I18nProvider>
      </body>
    </html>
  )
}

function SaveButton(handle: Handle) {
  let t = getTranslator(handle, 'common')

  return () => <button type="button">{t.gettext('Save')}</button>
}
```

If a hydrated component asks for a namespace that was not included in the provider state, `getTranslator(handle, namespace)` throws a clear error. Declare the namespaces needed by each route, controller, or frame and aggregate them before rendering.

## Locale Fallbacks

By default, locale fallbacks are derived from the locale tag and default locale:

```ts
createLocaleFallbacks('fr-CH', 'en')
// ['fr-CH', 'fr', 'en']
```

You can customize fallbacks:

```ts
i18n({
  supportedLocales: ['en', 'fr', 'fr-CH'],
  defaultLocale: 'en',
  catalogs,
  fallbackLocales(locale) {
    if (locale === 'fr-CH') return ['fr', 'en']
    return ['en']
  },
})
```

## Lazy Messages

Lazy messages let modules declare translatable text before a request locale exists:

```ts
import { gettextLazy } from 'remix/i18n'

let title = gettextLazy('Dashboard')

router.get('/dashboard', (context) => {
  let t = context.get(Translator)

  return new Response(t.resolve(title))
})
```

## Changing Locales

Prefer a full document reload when the user changes language. Let the server update the locale cookie or URL segment, redirect to the current page, rerun SSR, and send fresh namespace-scoped client state. This keeps server-rendered HTML and hydrated components in sync without a client-side catalog cache.

## Related Packages

- [`fetch-router`](https://github.com/remix-run/remix/tree/main/packages/fetch-router) provides request context and middleware.
- [`headers`](https://github.com/remix-run/remix/tree/main/packages/headers) provides `Accept-Language` parsing.
- [`ui`](https://github.com/remix-run/remix/tree/main/packages/ui) provides the component context used by `I18nProvider`.

## Related Work

- [Rails Internationalization API](https://guides.rubyonrails.org/i18n.html)
- [GNU gettext](https://www.gnu.org/software/gettext/)
- [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

## License

See [LICENSE](https://github.com/remix-run/remix/blob/main/LICENSE)
