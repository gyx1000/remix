import * as assert from '@remix-run/assert'
import { describe, it } from '@remix-run/test'

import { createIntl, dateTime, displayName, list, number, relativeTime } from './intl.ts'

describe('createIntl', () => {
  it('formats values with built-in Intl formatters', () => {
    let intl = createIntl('en-US')

    assert.equal(intl.formatNumber(1234.5, { style: 'currency', currency: 'USD' }), '$1,234.50')
    assert.equal(
      intl.formatDateTime(new Date('2026-05-14T10:30:00Z'), {
        timeZone: 'UTC',
        dateStyle: 'medium',
      }),
      'May 14, 2026',
    )
    assert.equal(intl.formatRelativeTime(-1, 'day', { numeric: 'auto' }), 'yesterday')
    assert.equal(intl.formatList(['A', 'B', 'C'], { type: 'conjunction' }), 'A, B, and C')
    assert.equal(intl.formatDisplayName('CH', { type: 'region' }), 'Switzerland')
  })

  it('selects plurals, compares strings, and segments text', () => {
    let intl = createIntl('en')

    assert.equal(intl.selectPlural(1), 'one')
    assert.equal(intl.compare('a', 'b') < 0, true)
    assert.deepEqual(
      [...intl.segment('Hello world', { granularity: 'word' })]
        .filter((segment) => segment.isWordLike)
        .map((segment) => segment.segment),
      ['Hello', 'world'],
    )
  })

  it('formats tagged values for message interpolation', () => {
    let intl = createIntl('en-US')

    assert.equal(intl.formatValue(number(42)), '42')
    assert.equal(
      intl.formatValue(dateTime('2026-05-14T10:30:00Z', { timeZone: 'UTC', year: 'numeric' })),
      '2026',
    )
    assert.equal(intl.formatValue(relativeTime(2, 'week')), 'in 2 weeks')
    assert.equal(intl.formatValue(list(['red', 'blue'])), 'red and blue')
    assert.equal(intl.formatValue(displayName('fr', { type: 'language' })), 'French')
  })
})
