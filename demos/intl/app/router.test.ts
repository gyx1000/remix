import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from './router.ts'

describe('intl router', () => {
  it('renders the default English page', async () => {
    let response = await router.fetch('https://intl.test/')

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Content-Type'), 'text/html; charset=UTF-8')

    let html = await response.text()
    assert.ok(html.includes('Request-scoped internationalization'))
    assert.ok(html.includes('Active locale'))
    assert.ok(html.includes('English'))
    assert.ok(html.includes('Fallback chain'))
  })

  it('renders Swiss French with locale and catalog fallbacks', async () => {
    let response = await router.fetch('https://intl.test/?locale=fr-CH')

    assert.equal(response.status, 200)

    let html = await response.text()
    assert.ok(html.includes('Français (Suisse)'))
    assert.ok(html.includes('fr-CH -&gt; fr -&gt; en'))
    assert.ok(html.includes('Commande'))
    assert.ok(html.includes('Enregistrer les paramètres du compte'))
    assert.ok(html.includes('Montant à payer'))
  })

  it('falls back from unsupported regional French to base French', async () => {
    let response = await router.fetch('https://intl.test/?locale=fr-CA')

    assert.equal(response.status, 200)

    let html = await response.text()
    assert.ok(html.includes('fr-CA -&gt; fr -&gt; en'))
    assert.ok(html.includes('Internationalisation par requête'))
    assert.ok(html.includes('Paiement'))
    assert.ok(html.includes('Enregistrer les paramètres du compte'))
  })

  it('returns 404 for unknown routes', async () => {
    let response = await router.fetch('https://intl.test/does-not-exist')

    assert.equal(response.status, 404)
  })
})
