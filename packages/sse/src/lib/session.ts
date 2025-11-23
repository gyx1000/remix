export interface SseSessionOptions {
  padding?: boolean
  preamble?: boolean
  keepAlive?: number
  retry?: number
}

export function createSseSession(request: Request, options: SseSessionOptions) {
  let controller = new AbortController()
  let signal = request.signal
  let { readable, writable } = new TransformStream()
  let writer = writable.getWriter()
  let connected = false
  let keepAliveInterval: ReturnType<typeof setInterval> | undefined
  let lastId = request.headers.get('last-event-id')

  let cleanup = () => {
    controller.abort()
    connected = false
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval)
    }
    writer.close()
    signal.removeEventListener('abort', cleanup)
  }

  signal.addEventListener('abort', cleanup, { once: true })

  let flush = () => {
    writer.write('\n')
  }

  if (options.padding == true) {
    let padding = ' '.repeat(2049)
    writer.write(`:${padding}\n`)
    flush()
  }
  if (options.preamble == true) {
    let preamble = ' '.repeat(2056)
    writer.write(`:${preamble}\n`)
    flush()
  }
  if (options.retry) {
    writer.write(`retry:${options.retry}\n`)
    flush()
  }
  if (options.keepAlive) {
    keepAliveInterval = setInterval(() => {
      writer.write(':\n')
      flush()
    }, options.keepAlive)
  }

  connected = true
  return {
    signal: controller.signal,
    stream: readable,
    push: (event: string, data: string, id: string = crypto.randomUUID()) => {
      if (!connected) throw new Error(`Could not push on disconnected session`)
      lastId = id
      writer.write(`id:${id}\n`)
      writer.write(`event:${event}\n`)
      writer.write(`data:${data}\n`)
      flush()
    },
    get lastId() {
      return lastId
    },
    get connected() {
      return connected
    },
  }
}
