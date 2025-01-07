import { expect, describe, it } from 'vitest'
import { getRandomString } from './randomStringHelper'

describe('helper', () => {
  describe('getRandomString', () => {
    it.each([
      {
        length: 0,
      },
      {
        length: 8,
      },
      {
        length: 10,
      },
    ])(
      'should return a random string of $length characters',
      ({ length }) => {
        expect(getRandomString(length).length).toBe(length)
      },
    )
  })
})
