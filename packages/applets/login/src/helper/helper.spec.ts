import { expect, describe, it } from 'vitest'
import { userNameGenerator } from '.'

describe('helper', () => {
  describe('userNameGenerator', () => {
    it.each([
      {
        lengthName: 8,
      },
      {
        lengthName: 10,
      },
    ])(
      'should return a randomly user name generated of $lengthName characters',
      ({ lengthName }) => {
        expect(userNameGenerator(lengthName).length).toBe(lengthName)
      },
    )
  })
})
