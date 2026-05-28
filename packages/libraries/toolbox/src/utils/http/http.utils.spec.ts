import { appendArrayParams, serializeParams } from './http.utils'

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

  describe('appendArrayParams', () => {
    it('should append multiple numeric values with the same key', () => {
      const params = new URLSearchParams()
      appendArrayParams(params, 'ids', [1, 2, 3])

      expect(params.toString()).toBe('ids=1&ids=2&ids=3')
    })

    it('should append multiple string values with the same key', () => {
      const params = new URLSearchParams()
      appendArrayParams(params, 'tags', ['alpha', 'beta', 'gamma'])

      expect(params.toString()).toBe('tags=alpha&tags=beta&tags=gamma')
    })

    it('should do nothing when values is undefined', () => {
      const params = new URLSearchParams()
      appendArrayParams(params, 'ids', undefined)

      expect(params.toString()).toBe('')
    })

    it('should do nothing when values is an empty array', () => {
      const params = new URLSearchParams()
      appendArrayParams(params, 'ids', [])

      expect(params.toString()).toBe('')
    })

    it('should append to existing params without overriding', () => {
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('size', '10')
      appendArrayParams(params, 'categoryIds', [5, 10])

      expect(params.toString()).toBe('page=1&size=10&categoryIds=5&categoryIds=10')
    })

    it('should handle mixed numeric and string values', () => {
      const params = new URLSearchParams()
      appendArrayParams(params, 'mixed', [1, 'two', 3])

      expect(params.toString()).toBe('mixed=1&mixed=two&mixed=3')
    })
  })
})
