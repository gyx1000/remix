import type { Handle, RemixNode } from 'remix/ui'

type PanelProps = {
  title: string
  children?: RemixNode
}

export function Panel(handle: Handle<PanelProps>) {
  return () => (
    <section
      style={{
        border: '1px solid #d8d4c8',
        borderRadius: 8,
        background: '#fff',
        padding: 18,
        minHeight: 160,
      }}
    >
      <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>{handle.props.title}</h2>
      {handle.props.children}
    </section>
  )
}
