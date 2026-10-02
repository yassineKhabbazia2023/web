import { toggled, withValue, withoutValue } from './set.utils'

describe('toggled', () => {
  it('should add a value the set does not hold', () => {
    expect(toggled(new Set(['a']), 'b')).toEqual(new Set(['a', 'b']))
  })

  it('should remove a value the set holds', () => {
    expect(toggled(new Set(['a', 'b']), 'b')).toEqual(new Set(['a']))
  })

  it('should leave the given set untouched', () => {
    const values = new Set(['a'])

    expect(toggled(values, 'a')).not.toBe(values)
    expect(values).toEqual(new Set(['a']))
  })
})

describe('withValue', () => {
  it('should add the value to a copy of the set', () => {
    const values = new Set([1])
    const next = withValue(values, 2)

    expect(next).not.toBe(values)
    expect(next).toEqual(new Set([1, 2]))
    expect(values).toEqual(new Set([1]))
  })
})

describe('withoutValue', () => {
  it('should remove the value', () => {
    expect(withoutValue(new Set([1, 2]), 2)).toEqual(new Set([1]))
  })

  it('should return an equal copy when the value is absent', () => {
    const values = new Set([1])
    const next = withoutValue(values, 2)

    expect(next).not.toBe(values)
    expect(next).toEqual(new Set([1]))
  })
})
