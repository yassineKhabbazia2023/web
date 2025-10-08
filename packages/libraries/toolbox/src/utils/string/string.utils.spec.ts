import { getAlphanumericString } from './string.utils'

describe('string.utils', () => {
  describe('getAlphanumericString', () => {
    const testCases = [{
      input: 'ab\'c123!@#',
      expected: 'ab c123',
    }, {
      input: 'hello  world !',
      expected: 'hello world',
    }, {
      input: '123$%^456',
      expected: '123 456',
    }, {
      input: 'çÇ àâäÀÂÄ èéêëÈÉÊË îïÎÏ ôÔ ùûüÙÛÜ æÆ œŒ €',
      expected: 'cC aaaAAA eeeeEEEE iiII oO uuuUUU aeAE oeOE EURO',
    }, {
      input: undefined,
      expected: '',
    }]

    it.each(testCases)(
      'should replace non-alphanumeric characters in "%s" with "%s"',
      ({
        input,
        expected,
      }) => {
        const result = getAlphanumericString(input)
        expect(result).toBe(expected)
      },
    )
  })
})
