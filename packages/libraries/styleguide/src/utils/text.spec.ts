import { describe, it, expect } from 'vitest'
import { capitalize } from './text'

describe('capitalize', () => {
  it('should uppercase the first letter of the given tring', () => {
    const value = 'this is an awesome example'
    const expectedResult = 'This is an awesome example'
    const result = capitalize(value)
    expect(result).toStrictEqual(expectedResult)
  })

  it('should accept an empty string and return it as is', () => {
    const value = ''
    const expectedResult = ''
    const result = capitalize(value)
    expect(result).toStrictEqual(expectedResult)
  })
})
