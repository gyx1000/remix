import type { Handle, RemixNode } from '@remix-run/ui'

import {
  createTranslator,
  type I18nClientState,
  type NamespaceTranslator,
  type Translator,
} from './translator.ts'

export interface I18nProviderProps {
  state: I18nClientState
  children?: RemixNode
}

export interface I18nContext {
  translator: Translator
  state: I18nClientState
}

export function I18nProvider(handle: Handle<I18nProviderProps, I18nContext>) {
  return () => {
    handle.context.set(createI18nContext(handle.props.state))
    return handle.props.children
  }
}

function createI18nContext(state: I18nClientState): I18nContext {
  let translator = createTranslator({
    locale: state.locale,
    defaultLocale: state.fallbackChain.at(-1) ?? state.locale,
    catalogs: {
      [state.locale]: state.namespaces,
    },
  })

  return { translator, state }
}

export function getTranslator(handle: Handle<unknown>): Translator
export function getTranslator(handle: Handle<unknown>, namespace: string): NamespaceTranslator
export function getTranslator(
  handle: Handle<unknown>,
  namespace?: string,
): Translator | NamespaceTranslator {
  let context = handle.context.get(I18nProvider)

  if (context === undefined) {
    throw new Error('No i18n provider found in component context.')
  }

  if (namespace === undefined) {
    return context.translator
  }

  let namespaceCatalog = context.state.namespaces[namespace]
  if (namespaceCatalog === undefined) {
    throw new Error(`Missing i18n namespace "${namespace}". Add it to <I18nProvider state={...}>.`)
  }

  return context.translator.namespace(namespace)
}
