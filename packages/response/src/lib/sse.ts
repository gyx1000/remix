export function createSseResponse(body: ReadableStream, init?: ResponseInit): Response {
  let headers = new Headers(init?.headers)

  headers.set('Content-Type', 'text/event-stream')
  headers.set('Cache-Control', 'no-cache')
  headers.set('Connection', 'keep-alive')

  return new Response(body, { ...init, headers })
}
