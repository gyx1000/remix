import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'
import type { Handle } from '@remix-run/ui'
import { renderToString } from '@remix-run/ui/server'

import { I18nProvider, getTranslator } from './ui.ts'

describe('I18nProvider', () => {
  it('provides a hydrated client translator from flattened client state', async () => {
    function Label(handle: Handle) {
      let t = getTranslator(handle, 'common')
      return () => <span>{t.gettext('Save')}</span>
    }

    let html = await renderToString(
      <I18nProvider
        state={{
          locale: 'fr-CH',
          fallbackChain: ['fr-CH', 'fr', 'en'],
          namespaces: {
            common: {
              Save: 'Enregistrer',
            },
          },
        }}
      >
        <Label />
      </I18nProvider>,
    )

    assert.equal(html, '<span>Enregistrer</span>')
  })

  it('throws a clear error for a missing namespace', async () => {
    function Label(handle: Handle) {
      let t = getTranslator(handle, 'admin')
      return () => <span>{t.gettext('Save')}</span>
    }

    await assert.rejects(
      () =>
        renderToString(
          <I18nProvider
            state={{
              locale: 'fr',
              fallbackChain: ['fr', 'en'],
              namespaces: {
                common: {
                  Save: 'Enregistrer',
                },
              },
            }}
          >
            <Label />
          </I18nProvider>,
        ),
      /Missing i18n namespace "admin"/,
    )
  })
})
