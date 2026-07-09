import { canonicalize, hashRequest, normalizeBody, normalizeQuery, pathToFolder } from './match'

describe('normalizeQuery', () => {
  it('returns an empty object for an empty query string', () => {
    expect(normalizeQuery('')).toEqual({})
  })

  it('returns a single string value when a key appears once', () => {
    expect(normalizeQuery('a=1&b=2')).toEqual({ a: '1', b: '2' })
  })

  it('sorts keys alphabetically so parameter order does not matter', () => {
    expect(Object.keys(normalizeQuery('b=2&a=1'))).toEqual(['a', 'b'])
  })

  it('groups repeated keys into a sorted array of values', () => {
    expect(normalizeQuery('tag=z&tag=a')).toEqual({ tag: ['a', 'z'] })
  })
})

describe('normalizeBody', () => {
  it('returns an empty marker when the buffer is undefined', () => {
    expect(normalizeBody(undefined, 'application/json')).toEqual({ encoding: 'empty', data: null })
  })

  it('parses JSON bodies when Content-Type is application/json', () => {
    const body = Buffer.from('{"a":1}')
    expect(normalizeBody(body, 'application/json; charset=utf-8')).toEqual({ encoding: 'json', data: { a: 1 } })
  })

  it('falls back to text when JSON parsing fails', () => {
    const body = Buffer.from('not-json')
    expect(normalizeBody(body, 'application/json')).toEqual({ encoding: 'text', data: 'not-json' })
  })

  it('treats text/* as text', () => {
    const body = Buffer.from('hello')
    expect(normalizeBody(body, 'text/plain')).toEqual({ encoding: 'text', data: 'hello' })
  })

  it('encodes unknown content types as base64', () => {
    const body = Buffer.from([0x00, 0xff, 0x10])
    expect(normalizeBody(body, 'application/octet-stream')).toEqual({
      encoding: 'base64',
      data: body.toString('base64'),
    })
  })
})

describe('canonicalize', () => {
  it('sorts object keys recursively so equal objects serialize identically', () => {
    expect(canonicalize({ b: 1, a: { y: 2, x: 1 } })).toBe(canonicalize({ a: { x: 1, y: 2 }, b: 1 }))
  })

  it('preserves array order', () => {
    expect(canonicalize([3, 1, 2])).toBe('[3,1,2]')
  })
})

describe('hashRequest', () => {
  it('returns identical hashes for semantically-equal requests with reordered query/body', () => {
    const a = hashRequest({
      method: 'POST',
      path: '/api/x',
      query: normalizeQuery('b=2&a=1'),
      body: { encoding: 'json', data: { y: 2, x: 1 } },
    })
    const b = hashRequest({
      method: 'post',
      path: '/api/x',
      query: normalizeQuery('a=1&b=2'),
      body: { encoding: 'json', data: { x: 1, y: 2 } },
    })
    expect(a).toBe(b)
  })

  it('returns different hashes when the body differs', () => {
    const a = hashRequest({
      method: 'POST',
      path: '/api/x',
      query: {},
      body: { encoding: 'json', data: { x: 1 } },
    })
    const b = hashRequest({
      method: 'POST',
      path: '/api/x',
      query: {},
      body: { encoding: 'json', data: { x: 2 } },
    })
    expect(a).not.toBe(b)
  })

  it('returns a 16-character hex hash', () => {
    const h = hashRequest({ method: 'GET', path: '/x', query: {}, body: { encoding: 'empty', data: null } })
    expect(h).toMatch(/^[0-9a-f]{16}$/)
  })
})

describe('pathToFolder', () => {
  it('returns `_root` for an empty or root path', () => {
    expect(pathToFolder('/')).toBe('_root')
    expect(pathToFolder('')).toBe('_root')
  })

  it('strips leading and trailing slashes and keeps inner segments', () => {
    expect(pathToFolder('/api/users/602/')).toBe('api/users/602')
  })

  it('replaces unsafe characters in segments', () => {
    expect(pathToFolder('/api/users with space/x?y')).toBe('api/users_with_space/x_y')
  })

  it('neutralizes traversal segments so the mock cannot escape its root folder', () => {
    expect(pathToFolder('/../etc/passwd')).toBe('_/etc/passwd')
    expect(pathToFolder('/api/../../secret')).toBe('api/_/_/secret')
    expect(pathToFolder('/./api')).toBe('_/api')
  })
})
