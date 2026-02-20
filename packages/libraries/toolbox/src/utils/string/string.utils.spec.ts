import { formatFrenchPhoneNumber, formatPhoneNumber, getAlphanumericString } from './string.utils'

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

  describe('formatFrenchPhoneNumber', () => {
    const testCases = [{
      input: '0612345678',
      expected: '+33612345678',
    }, {
      input: '0123456789',
      expected: '+33123456789',
    }, {
      input: '+33612345678',
      expected: '+33612345678',
    }, {
      input: undefined,
      expected: '',
    }, {
      input: '',
      expected: '',
    }]

    it.each(testCases)(
      'should format phone number "$input" to "$expected"',
      ({
        input,
        expected,
      }) => {
        const result = formatFrenchPhoneNumber(input)
        expect(result).toBe(expected)
      },
    )
  })

  describe('formatPhoneNumber', () => {
    const testCases = [{
      input: '0612345678',
      expected: '06 12 34 56 78',
    }, {
      input: '0123456789',
      expected: '01 23 45 67 89',
    }, {
      input: undefined,
      expected: '',
    }, {
      input: null,
      expected: '',
    }, {
      input: '',
      expected: '',
    }]

    it.each(testCases)(
      'should format phone number "$input" to "$expected"',
      ({
        input,
        expected,
      }) => {
        const result = formatPhoneNumber(input)
        expect(result).toBe(expected)
      },
    )
  })
})
