import { run } from 'remix/ui'

const app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    let record = mod as Record<string, unknown>
    let exported = record[exportName]

    if (typeof exported !== 'function') {
      throw new Error(`Export "${exportName}" from "${moduleUrl}" is not a function`)
    }

    return exported
  },
  async resolveFrame(src, signal) {
    let response = await fetch(src, { headers: { Accept: 'text/html' }, signal })

    if (!response.ok) {
      return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`
    }

    if (response.body) return response.body
    return await response.text()
  },
})

app.ready().catch((error: unknown) => console.error(error))
