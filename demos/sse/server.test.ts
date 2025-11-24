import { createRouter } from '@remix-run/fetch-router'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { createSseSession } from '@remix-run/sse'
import { once } from 'events'
import { createServer } from 'http'
import { describe, it } from 'node:test'
import * as res from '@remix-run/fetch-router/response-helpers'
import type { AddressInfo } from 'net'

describe('Test sse endpoint', async () => {
  it('should abort request correctly', async (t) => {
    t.plan(1)

    let router = createRouter()
    router.get('/sse', async ({ request }) => {
      let sse = createSseSession(request, {})

      let interval = setInterval(() => {
        sse.push('message', Date.now().toString())
      })

      request.signal.addEventListener('abort', () => {
        console.log('fully aborted !')
        clearInterval(interval)
      })

      return res.sse(sse.stream)
    })

    // run the nodejs server
    let server = createServer(
      createRequestListener(async (request) => {
        try {
          request.signal.addEventListener('abort', () => {
            console.log(`Aborted there !`)
          })
          return await router.fetch(request)
        } catch (error) {
          console.log(error)
          return new Response(`Internal Error`, { status: 500 })
        }
      }),
    ).listen(0)
    t.after(() => server.close())

    // simulate a client request
    const ac = new AbortController()
    let req = new Request(`http://localhost:${(server.address() as AddressInfo).port}/sse`, {
      signal: ac.signal,
    })
    setTimeout(() => {
      // force GC
      global.gc!()
      // client cancel the request
      ac.abort()
    }, 500)

    await once(server, 'listening')
    let response = await fetch(req)
    t.assert.equal(response.status, 200)
  })
})
