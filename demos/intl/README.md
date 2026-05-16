# intl demo

This demo shows how `remix/intl` works for full-document SSR.

## What It Demonstrates

- Request-scoped locale negotiation with `intl()` middleware
- Hierarchical translation keys and scoped translators
- Server-precomputed fallback resolution such as `fr-CH -> fr -> en`
- Full document reload for language changes

## Run

```sh
pnpm -C demos/intl start
```

Open http://localhost:44100.

For development with a watched server:

```sh
pnpm -C demos/intl dev
```
