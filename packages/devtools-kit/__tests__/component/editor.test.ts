import { RefStateEditor } from '../../src/core/component/state/editor'

describe('editor: RefStateEditor', () => {
  const editor = new RefStateEditor()

  // Plain object
  // eslint-disable-next-line test/consistent-test-it
  test.each([
    // Plain object.
    // Add new key.
    { refValue: { foo: 'bar' }, newValue: { foo: 'bar', bar: 'baz' } },
    // Add new key and modify origin value.
    { refValue: { foo: 'bar' }, newValue: { foo: 'barr', bar: 'baz' } },
    // Modify origin value.
    { refValue: { foo: 'bar' }, newValue: { foo: 'barr' } },
    // Remove key.
    { refValue: { foo: 'bar' }, newValue: {} },
    // Remove key and modify origin value.
    { refValue: { foo: 'bar' }, newValue: { foo: 'barr' } },
    // Remove key and add new key.
    { refValue: { foo: 'bar' }, newValue: { bar: 'baz' } },
  ])('$refValue can be modified to $newValue by RefStateEditor.set', ({ refValue, newValue }) => {
    editor.set(refValue as any, newValue)
    expect(refValue).toEqual(newValue)
  })

  // Native set
  it('refStateEditor.set on native set', () => {
    const refValue = new Set(['foo', 'bar'])
    const newValue = ['baz', 'foo', 'bar']
    const targetValue = new Set(['baz', 'foo', 'bar'])
    editor.set(refValue as any, newValue)
    expect(refValue).toEqual(targetValue)
  })

  // Native map
  // eslint-disable-next-line test/consistent-test-it
  test.each([
    // Add new key.
    { refValue: new Map([['foo', 'bar']]), newValue: { foo: 'bar', bar: 'baz' }, targetValue: new Map([['foo', 'bar'], ['bar', 'baz']]) },
    // Add new key and modify origin value.
    { refValue: new Map([['foo', 'bar']]), newValue: { foo: 'barr', bar: 'baz' }, targetValue: new Map([['foo', 'barr'], ['bar', 'baz']]) },
    // Add new key and modify origin value.
    { refValue: new Map([['foo', 'bar']]), newValue: { foo: 'barr', bar: 'baz' }, targetValue: new Map([['foo', 'barr'], ['bar', 'baz']]) },
    // Modify origin value.
    { refValue: new Map([['foo', 'bar']]), newValue: { foo: 'barr' }, targetValue: new Map([['foo', 'barr']]) },
    // Remove key.
    { refValue: new Map([['foo', 'bar']]), newValue: {}, targetValue: new Map() },
    // Remove key and modify origin value.
    { refValue: new Map([['foo', 'bar']]), newValue: { foo: 'barr' }, targetValue: new Map([['foo', 'barr']]) },
    // Remove key and add new key.
    { refValue: new Map([['foo', 'bar']]), newValue: { bar: 'baz' }, targetValue: new Map([['bar', 'baz']]) },
  ])('%o can be modified to $newValue by RefStateEditor.set', ({ refValue, newValue, targetValue }) => {
    editor.set(refValue as any, newValue)
    expect(refValue).toEqual(targetValue || newValue)
  })
})
