import { formatFrenchPhoneNumber, formatPhoneNumber, getAlphanumericString, containsIgnoreCase, getStringInitials } from './string.utils'

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

  describe('containsIgnoreCase', () => {
    it('should return true if substring is present (case-insensitive)', () => {
      expect(containsIgnoreCase('Hello World', 'hello')).toBe(true)
      expect(containsIgnoreCase('Hello World', 'WORLD')).toBe(true)
      expect(containsIgnoreCase('Hello World', 'o w')).toBe(true)
    })

    it('should return false if substring is not present', () => {
      expect(containsIgnoreCase('Hello World', 'foo')).toBe(false)
      expect(containsIgnoreCase('Hello World', 'HELLOWORLD')).toBe(false)
    })

    it('should return true if searchValue is empty string', () => {
      expect(containsIgnoreCase('Hello World', '')).toBe(true)
    })

    it('should return false if text is empty string and searchValue is not', () => {
      expect(containsIgnoreCase('', 'hello')).toBe(false)
    })
  })

  describe('getStringInitials', () => {
    const testCases = [{
      input: 'John Doe',
      length: 2,
      expected: 'JO',
    }, {
      input: 'Société Anonyme',
      length: 2,
      expected: 'SO',
    }, {
      input: 'ABC Company',
      length: 3,
      expected: 'ABC',
    }, {
      input: 'x',
      length: 2,
      expected: 'X',
    }, {
      input: '',
      length: 2,
      expected: '',
    }, {
      input: 'lowercase',
      length: 2,
      expected: 'LO',
    }]

    it.each(testCases)(
      'should extract $length characters from "$input" and return "$expected"',
      ({ input, length, expected }) => {
        const result = getStringInitials(input, length)
        expect(result).toBe(expected)
      },
    )

    it('should use default length of 2 when length is not provided', () => {
      expect(getStringInitials('Hello World')).toBe('HE')
    })
  })
})
