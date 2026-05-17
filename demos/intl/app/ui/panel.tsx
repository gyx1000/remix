import type { Handle, RemixNode } from 'remix/ui'

import * as styles from './styles.ts'

type PanelProps = {
  title: string
  wide?: boolean
  children?: RemixNode
}

export function Panel(handle: Handle<PanelProps>) {
  return () => (
    <section mix={handle.props.wide ? [styles.panel, styles.panelWide] : styles.panel}>
      <h2 mix={styles.panelTitle}>{handle.props.title}</h2>
      {handle.props.children}
    </section>
  )
}
