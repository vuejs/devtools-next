import { RefStateEditor } from '../../src/core/component/state/editor'

describe('editor: RefStateEditor', () => {
  const editor = new RefStateEditor()

  // eslint-disable-next-line test/consistent-test-it
  test.each([
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
})
