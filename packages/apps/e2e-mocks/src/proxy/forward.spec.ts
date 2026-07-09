import type { IncomingMessage } from 'node:http'
import { Readable } from 'node:stream'
import { buildForwardHeaders, forwardToTarget, readRequestBody, recordedBodyToBuffer } from './forward'

afterEach(() => {
  vi.unstubAllGlobals()
})

function createReq(body?: string): IncomingMessage {
  const readable = new Readable({ read() {} })
  if (body !== undefined) {
    readable.push(Buffer.from(body))
  }
  readable.push(null)
  return readable as unknown as IncomingMessage
}

describe('readRequestBody', () => {
  it('buffers all chunks of the incoming request', async () => {
    const body = await readRequestBody(createReq('hello world'))
    expect(body.toString('utf-8')).toBe('hello world')
  })

  it('resolves with an empty buffer when the request has no body', async () => {
    const body = await readRequestBody(createReq())
    expect(body.length).toBe(0)
  })
})

describe('buildForwardHeaders', () => {
  it('lowercases header names and joins array values', () => {
    const headers = buildForwardHeaders({ Accept: ['application/json', 'text/plain'] })
    expect(headers).toEqual({ accept: 'application/json, text/plain' })
  })

  it('strips hop-by-hop headers', () => {
    const headers = buildForwardHeaders({
      host: 'localhost:9000',
      connection: 'keep-alive',
      'content-length': '42',
      authorization: 'Bearer token',
    })
    expect(headers).toEqual({ authorization: 'Bearer token' })
  })

  it('ignores undefined header values', () => {
    const headers = buildForwardHeaders({ 'x-custom': undefined })
    expect(headers).toEqual({})
  })
})

describe('forwardToTarget', () => {
  it('joins the target and path, uppercases the method and forwards the body for non-GET requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 201, statusText: 'Created', headers: { 'content-type': 'application/json' } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await forwardToTarget('https://remote.example.test/', 'post', '/api/users?id=1', { 'content-type': 'application/json' }, Buffer.from('{"name":"a"}'))

    expect(fetchMock).toHaveBeenCalledWith('https://remote.example.test/api/users?id=1', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      redirect: 'manual',
      body: new Uint8Array(Buffer.from('{"name":"a"}')),
    })
    expect(result).toEqual({
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      body: { encoding: 'json', data: { ok: true } },
    })
  })

  it('does not send a body for GET requests even if one is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204, statusText: 'No Content' }))
    vi.stubGlobal('fetch', fetchMock)

    await forwardToTarget('https://remote.example.test', 'GET', '/api/users', {}, Buffer.from('ignored'))

    expect(fetchMock).toHaveBeenCalledWith('https://remote.example.test/api/users', expect.not.objectContaining({ body: expect.anything() }))
  })

  it('strips hop-by-hop headers from the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('ok', { status: 200, headers: { 'content-type': 'text/plain', connection: 'keep-alive' } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await forwardToTarget('https://remote.example.test', 'GET', '/api/ping', {}, Buffer.alloc(0))

    expect(result.headers).toEqual({ 'content-type': 'text/plain' })
  })
})

describe('recordedBodyToBuffer', () => {
  it('returns an empty buffer for the empty encoding', () => {
    expect(recordedBodyToBuffer({ encoding: 'empty', data: null }).length).toBe(0)
  })

  it('serializes JSON data', () => {
    expect(recordedBodyToBuffer({ encoding: 'json', data: { a: 1 } }).toString('utf-8')).toBe('{"a":1}')
  })

  it('encodes text data as UTF-8', () => {
    expect(recordedBodyToBuffer({ encoding: 'text', data: 'hello' }).toString('utf-8')).toBe('hello')
  })

  it('decodes base64 data', () => {
    const encoded = Buffer.from('binary-data').toString('base64')
    expect(recordedBodyToBuffer({ encoding: 'base64', data: encoded }).toString('utf-8')).toBe('binary-data')
  })
})
