import { createRouter } from '@remix-run/fetch-router'
import { createSseSession } from '@remix-run/sse'
import { describe, it } from 'node:test'
import { createSseResponse } from '@remix-run/response/sse'

describe('Test sse endpoint', async () => {
  it('should abort request correctly', async (t) => {
    t.plan(2)
    let aborted = false
    let router = createRouter()
    router.get('/sse', async ({ request }) => {
      let sse = createSseSession(request, {})

      let interval = setInterval(() => {
        sse.push('message', Date.now().toString())
      }, 200)

      request.signal.addEventListener('abort', () => {
        aborted = true
        clearInterval(interval)
      })

      return createSseResponse(sse.stream)
    })

    let ac = new AbortController()
    let req = new Request('http://localhost/sse', { signal: ac.signal })

    setTimeout(() => {
      // force GC
      global.gc!()
      // client cancel the request
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
    t.assert.equal(aborted, true)
  })
})
