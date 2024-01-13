import * as format from '../format'
import { INFINITY, NAN, NEGATIVE_INFINITY, UNDEFINED } from '../constants'

describe('format: displayText and rawValue can be calculated by formatInspectorStateValue, getRawValue', () => {
  describe('type: literals', () => {
    // eslint-disable-next-line test/consistent-test-it
    test.each([
      { literal: 'test-string', displayText: 'test-string' },
      { literal: 123, displayText: 123 },
      { literal: true, displayText: true },
      { literal: null, displayText: 'null' },
      // Tokenlized values
      { literal: INFINITY, displayText: 'Infinity' },
      { literal: NAN, displayText: 'NaN' },
      { literal: NEGATIVE_INFINITY, displayText: '-Infinity' },
      { literal: UNDEFINED, displayText: 'undefined' },
    ])('type: %s', (value) => {
      const displayText = format.formatInspectorStateValue(value.literal)
      const rawValue = format.getRawValue(value.literal).value

      expect(displayText).toBe(value.displayText)
      expect(rawValue).toBe(value.literal)
    })
  })

  it('type: plain object', () => {
    const value = { foo: 'bar' }
    const displayText = format.formatInspectorStateValue(value)
    const rawValue = format.getRawValue(value).value

    expect(displayText).toBe('Object')
    expect(rawValue).toEqual(value)
  })

  it('type: array', () => {
    const value = ['foo', { bar: 'baz' }]
    const displayText = format.formatInspectorStateValue(value)
    const rawValue = format.getRawValue(value).value

    expect(displayText).toBe('Array[2]')
    expect(rawValue).toEqual(value)
  })

  describe('type: custom', () => {
    it('type: common custom', () => {
      const value = { _custom: { displayText: 'custom-display', value: Symbol(123) } }
      const displayText = format.formatInspectorStateValue(value)
      const rawValue = format.getRawValue(value).value

      expect(displayText).toBe(value._custom.displayText)
      expect(rawValue).toEqual(value._custom.value)
    })

    it('type: nested custom', () => {
      const value = {
        _custom: {
          displayText: 'custom-display',
          value: {
            _custom: { displayText: 'nested-custom-display', value: Symbol(123) },
          },
        },
      }

      const displayText = format.formatInspectorStateValue(value)
      const rawValue = format.getRawValue(value).value

      expect(displayText).toBe(value._custom.value._custom.displayText)
      expect(rawValue).toEqual(value._custom.value._custom.value)
    })
  })
})
