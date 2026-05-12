# i18n demo

This demo shows how `remix/i18n` works across full-document SSR, hydrated client entries, and `remix/ui` Frames.

## What It Demonstrates

- Request-scoped locale negotiation with `i18n()` middleware
- Rails-style translation keys with namespace-scoped client state
- Server-precomputed fallback resolution such as `fr-CH -> fr -> en`
- `I18nProvider` and `getTranslator(handle, namespace)` in hydrated components
- Full document reload for language changes
- Frames that run their own request lifecycle and receive their own i18n client state

## Run

```sh
pnpm -C demos/i18n run build:browser
pnpm -C demos/i18n start
```

Open http://localhost:44100.

For development with a watched server and browser bundle:

```sh
pnpm -C demos/i18n dev
```
