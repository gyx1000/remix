import { css } from 'remix/ui'

const colors = {
  background: '#f7f5ef',
  border: '#d8d4c8',
  borderMuted: '#e5e1d6',
  controlBorder: '#b9b2a2',
  panel: '#ffffff',
  panelMuted: '#fbfaf7',
  primary: '#1d4f91',
  text: '#172026',
  textMuted: '#52616b',
}

export const pageReset = css({
  '& *': {
    boxSizing: 'border-box',
  },
  '& button, & input, & select, & textarea': {
    font: 'inherit',
  },
})

export const page = css({
  margin: 0,
  minHeight: '100vh',
  background: colors.background,
  color: colors.text,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
})

export const header = css({
  borderBottom: '1px solid ' + colors.border,
  background: colors.panel,
})

export const headerInner = css({
  maxWidth: 1080,
  margin: '0 auto',
  padding: '18px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  '@media (max-width: 760px)': {
    alignItems: 'stretch',
    flexDirection: 'column',
    padding: 16,
  },
})

export const homeLink = css({
  color: colors.text,
  fontWeight: 700,
  textDecoration: 'none',
})

export const languageForm = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '@media (max-width: 760px)': {
    alignItems: 'stretch',
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
})

export const languageLabel = css({
  color: colors.textMuted,
  fontSize: 14,
})

export const languageSelect = css({
  border: '1px solid ' + colors.controlBorder,
  borderRadius: 6,
  padding: '7px 28px 7px 9px',
  background: colors.panel,
  color: colors.text,
  '@media (max-width: 760px)': {
    width: '100%',
  },
})

export const languageButton = css({
  border: '1px solid ' + colors.primary,
  borderRadius: 6,
  padding: '8px 12px',
  background: colors.primary,
  color: colors.panel,
  fontWeight: 600,
  '@media (max-width: 760px)': {
    width: '100%',
  },
})

export const main = css({
  maxWidth: 1080,
  margin: '0 auto',
  padding: 24,
  '@media (max-width: 760px)': {
    padding: 16,
  },
  '@media (max-width: 430px)': {
    padding: 12,
  },
})

export const hero = css({
  display: 'grid',
  alignItems: 'start',
  gap: 20,
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.6fr)',
  marginBottom: 20,
  '@media (max-width: 760px)': {
    gridTemplateColumns: '1fr',
  },
})

export const eyebrow = css({
  margin: '0 0 10px',
  color: colors.textMuted,
  fontWeight: 700,
})

export const heroTitle = css({
  margin: 0,
  fontSize: 44,
  lineHeight: 1.05,
  '@media (max-width: 760px)': {
    fontSize: 34,
    lineHeight: 1.1,
  },
  '@media (max-width: 430px)': {
    fontSize: 30,
  },
})

export const heroCopy = css({
  maxWidth: 720,
  color: colors.textMuted,
  fontSize: 18,
  lineHeight: 1.55,
})

export const metadataPanel = css({
  border: '1px solid ' + colors.border,
  borderRadius: 8,
  padding: 16,
  background: colors.panel,
})

export const metadataRow = css({
  margin: '0 0 10px',
})

export const metadataLabel = css({
  display: 'block',
  color: colors.textMuted,
  fontSize: 13,
})

export const contentGrid = css({
  display: 'grid',
  alignItems: 'stretch',
  gap: 16,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  '@media (max-width: 760px)': {
    gridTemplateColumns: '1fr',
  },
})

export const panel = css({
  minHeight: 160,
  border: '1px solid ' + colors.border,
  borderRadius: 8,
  padding: 18,
  background: colors.panel,
})

export const panelWide = css({
  gridColumn: '1 / -1',
})

export const compactPanel = css({
  maxWidth: 460,
})

export const panelTitle = css({
  margin: '0 0 12px',
  fontSize: 18,
})

export const compactPanelTitle = css({
  margin: '0 0 8px',
  fontSize: 18,
})

export const bodyCopy = css({
  color: colors.textMuted,
  lineHeight: 1.5,
})

export const compactCopy = css({
  margin: '0 0 12px',
  color: colors.textMuted,
  lineHeight: 1.45,
})

export const definitionList = css({
  display: 'grid',
  rowGap: 8,
  columnGap: 16,
  gridTemplateColumns: 'minmax(190px, max-content) minmax(0, 1fr)',
  margin: '16px 0 0',
  '@media (max-width: 430px)': {
    gridTemplateColumns: '1fr',
  },
})

export const definitionTerm = css({
  minWidth: 0,
  color: colors.textMuted,
  overflowWrap: 'anywhere',
})

export const definitionValue = css({
  margin: 0,
  minWidth: 0,
  fontWeight: 700,
  overflowWrap: 'anywhere',
})

export const examplesGrid = css({
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  '@media (max-width: 760px)': {
    gridTemplateColumns: '1fr',
  },
})

export const exampleCard = css({
  border: '1px solid ' + colors.borderMuted,
  borderRadius: 8,
  padding: 12,
  background: colors.panelMuted,
})

export const exampleTitle = css({
  margin: '0 0 6px',
  fontSize: 14,
})

export const exampleDescription = css({
  margin: '0 0 8px',
  color: colors.textMuted,
  fontSize: 13,
  lineHeight: 1.35,
})

export const codeBlock = css({
  display: 'block',
  borderRadius: 6,
  padding: '8px 10px',
  background: colors.text,
  color: colors.panel,
  fontSize: 13,
  overflowWrap: 'anywhere',
})

export const codeList = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
})
