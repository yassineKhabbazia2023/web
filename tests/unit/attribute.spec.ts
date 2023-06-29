import { isAttribute } from '../../src/utils/attribute'

describe('Styleguide attribute', () => {
    const expectedAttributes = [
      { expected: '\n  name', flag: true, name: 'name' },
      { expected: '', flag: false, name: 'name' }
    ]
    
  it.each(expectedAttributes)('calls isAttribute methods', ({ expected, flag, name }) => {
    expect(isAttribute(flag, name)).toBe(expected)
  })
})