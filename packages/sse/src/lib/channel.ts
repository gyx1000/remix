import { EventEmitter } from 'events'
import type { createSseSession } from './session'

export let createSseChannel = () => {
  let sessions = new Set<ReturnType<typeof createSseSession>>()
  let events = new EventEmitter()

  return {
    events,
    register: (session: ReturnType<typeof createSseSession>) => {
      let cleanup = () => {
        sessions.delete(session)
        events.emit('session-unregister', session)
      }

      if (sessions.has(session)) {
        console.log(`Already registered`)
        return
      }
      sessions.add(session)
      events.emit('session-register', session)
      session.events.on('disconnected', cleanup)
    },
    broadcast: (event: string, data: string, id: string = crypto.randomUUID()) => {
      for (let session of sessions) {
        if (!session.connected) continue
        session.push(event, data, id)
      }
    },
    get count() {
      return sessions.size
    },
  }
}
