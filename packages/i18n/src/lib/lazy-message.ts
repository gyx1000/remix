import type { I18nMessageOptions, Translator } from './translator.ts'

export type LazyMessage =
  | {
      type: 'gettext'
      message: string
      options?: I18nMessageOptions
    }
  | {
      type: 'pgettext'
      context: string
      message: string
      options?: Omit<I18nMessageOptions, 'context'>
    }
  | {
      type: 'ngettext'
      singular: string
      plural: string
      count: number
      options?: Omit<I18nMessageOptions, 'count'>
    }
  | {
      type: 'npgettext'
      context: string
      singular: string
      plural: string
      count: number
      options?: Omit<I18nMessageOptions, 'count' | 'context'>
    }

export function gettextLazy(message: string, options?: I18nMessageOptions): LazyMessage {
  return { type: 'gettext', message, options }
}

export function pgettextLazy(
  context: string,
  message: string,
  options?: Omit<I18nMessageOptions, 'context'>,
): LazyMessage {
  return { type: 'pgettext', context, message, options }
}

export function ngettextLazy(
  singular: string,
  plural: string,
  count: number,
  options?: Omit<I18nMessageOptions, 'count'>,
): LazyMessage {
  return { type: 'ngettext', singular, plural, count, options }
}

export function npgettextLazy(
  context: string,
  singular: string,
  plural: string,
  count: number,
  options?: Omit<I18nMessageOptions, 'count' | 'context'>,
): LazyMessage {
  return { type: 'npgettext', context, singular, plural, count, options }
}

export function resolveLazyMessage(translator: Translator, message: LazyMessage): string {
  switch (message.type) {
    case 'gettext':
      return translator.gettext(message.message, message.options)
    case 'pgettext':
      return translator.pgettext(message.context, message.message, message.options)
    case 'ngettext':
      return translator.ngettext(message.singular, message.plural, message.count, message.options)
    case 'npgettext':
      return translator.npgettext(
        message.context,
        message.singular,
        message.plural,
        message.count,
        message.options,
      )
  }
}
