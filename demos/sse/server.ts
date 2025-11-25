import * as http from 'node:http'
import { createRouter, route } from '@remix-run/fetch-router'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { logger } from '@remix-run/logger-middleware'
import { createSseChannel, createSseSession } from '@remix-run/sse'
import { createSseResponse } from '@remix-run/response/sse'
import { createHtmlResponse } from '@remix-run/response/html'
import { html } from '@remix-run/html-template'
import { on } from '@remix-run/interaction'

let routes = route({
  home: '/',
  sse: '/sse',
})

let router = createRouter({
  middleware: [logger()],
})

let dummyChannel = createSseChannel()
on(dummyChannel, {
  register: (evt) => {
    console.log(`Session register`, evt.session)
  },
  unregister: (evt) => {
    console.log(`Session unregister`, evt.session)
  },
})

router.map(routes, {
  home: ({ request }) => {
    return createHtmlResponse(
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

    dummyChannel.register(sse)
    let cleanup = () => {
      console.log(`cleanup`)
      clearInterval(interval)
      dispose()
    }

    let interval = setInterval(() => {
      console.log(`send message`)
      sse.push('message', JSON.stringify({ date: Date.now() }))
    }, 2_000)

    let dispose = on(sse, {
      disconnected: {
        once: true,
        listener: cleanup,
      },
    })

    return createSseResponse(sse.stream)
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

server.listen(6000, () => {
  console.log(`Server listening on port 6000`)
})
