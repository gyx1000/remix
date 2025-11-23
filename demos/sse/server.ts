import * as http from 'node:http'
import { createRouter, route } from '@remix-run/fetch-router'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { logger } from '@remix-run/logger-middleware'
import { createSseSession } from '@remix-run/sse'
import * as res from '@remix-run/fetch-router/response-helpers'
import { html } from '@remix-run/html-template'

let routes = route({
  home: '/',
  sse: '/sse',
})

let router = createRouter({
  middleware: [logger()],
})

router.map(routes, {
  home: ({ request }) => {
    return res.html(
      html`<html>
        <head> </head>
        <body>
          <h1>SSE Demo</h1>
          <script>
            const s = new EventSource('/sse')
            s.addEventListener('message', (evt) => {
              console.log('recieve message', evt.data)
            })
          </script>
        </body>
      </html>`,
    )
  },
  sse: async ({ request }) => {
    let sse = createSseSession(request, {
      keepAlive: 5_000,
      retry: 2_000,
      padding: true,
      preamble: true,
    })

    let interval = setInterval(() => {
      console.log(`send message`)
      sse.push('message', JSON.stringify({ date: Date.now() }))
    }, 2_000)

    sse.signal.addEventListener('abort', () => {
      console.log(`cleanup`)
      clearInterval(interval)
    })

    return res.sse(sse.stream)
  },
})
let server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.log(error)
      return new Response('Internal server error', { status: 500 })
    }
  }),
)

server.listen(44100, () => {
  console.log(`Server listening on port 44100`)
})
