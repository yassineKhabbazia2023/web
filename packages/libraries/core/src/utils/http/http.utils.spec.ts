import { serializeParams } from './http.utils'

describe('http.utils', () => {
  describe('serializeParams', () => {
    it.each([
      ['simple key-value pairs', { page: 1, size: 10 }, 'page=1&size=10'],
      [
        'array values are serialized as repeated keys',
        { status: ['online', 'offline'] },
        'status=online&status=offline',
      ],
      [
        'special characters are URL-encoded',
        { search: 'report 1', type: 'finance&legal' },
        'search=report%201&type=finance%26legal',
      ],
      [
        'mixed scalar and array values',
        { page: 2, status: ['active', 'pending'], query: 'test value' },
        'page=2&status=active&status=pending&query=test%20value',
      ],
      ['empty object results in empty string', {}, ''],
    ])('should serialize %s', (_desc, input, expected) => {
      expect(serializeParams(input)).toBe(expected)
    })
  })
})
