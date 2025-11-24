import { createRouter } from '@remix-run/fetch-router'
import { createSseSession } from '@remix-run/sse'
import { describe, it } from 'node:test'
import * as res from '@remix-run/fetch-router/response-helpers'

describe('Test sse endpoint', async () => {
  it('should abort request correctly', async (t) => {
    t.plan(1)

    let router = createRouter()
    router.get('/sse', async ({ request }) => {
      let sse = createSseSession(request, {})

      let interval = setInterval(() => {
        sse.push('message', Date.now().toString())
      }, 200)

      request.signal.addEventListener('abort', () => {
        console.log('fully aborted !')
        clearInterval(interval)
      })

      return res.sse(sse.stream)
    })

    let ac = new AbortController()
    let req = new Request('http://localhost/sse', { signal: ac.signal })

    setTimeout(() => {
      // force GC
      global.gc!()
      // client cancel the request
      console.log('abort the request')
      ac.abort()
    })

    let response = await router.fetch(req)
    t.assert.equal(response.status, 200)
    if (response.body) {
      let reader = response.body.getReader()
      try {
        while (true) {
          let result = await reader.read()
          if (result.done) break
        }
      } finally {
        reader.releaseLock()
      }
    }
  })
})
