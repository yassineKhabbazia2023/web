import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createProxyMiddleware } from './middleware'
import { saveMock } from './storage'
import { hashRequest } from './match'
import type { ProxyOptions, RecordedMock } from '../types/proxy.type'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proxy-middleware-'))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
  vi.unstubAllGlobals()
})

function createReq(overrides: { method?: string; url?: string; headers?: Record<string, string>; body?: string } = {}): IncomingMessage {
  const readable = new Readable({ read() {} })
  if (overrides.body !== undefined) {
    readable.push(Buffer.from(overrides.body))
  }
  readable.push(null)
  const req = readable as unknown as IncomingMessage
  req.method = overrides.method ?? 'GET'
  req.url = overrides.url ?? '/'
  req.headers = overrides.headers ?? {}
  return req
}

type ResHelpers = {
  res: ServerResponse
  getStatus: () => number
  getHeaders: () => Record<string, string>
  getBody: () => Buffer | string | undefined
}

function createRes(): ResHelpers {
  const headers: Record<string, string> = {}
  let statusCode = 200
  let body: Buffer | string | undefined
  const res = {
    setHeader(key: string, value: string) {
      headers[key.toLowerCase()] = value
    },
    end(chunk?: Buffer | string) {
      body = chunk
    },
  }
  Object.defineProperty(res, 'statusCode', {
    get: () => statusCode,
    set: (value: number) => {
      statusCode = value
    },
  })
  return {
    res: res as unknown as ServerResponse,
    getStatus: () => statusCode,
    getHeaders: () => headers,
    getBody: () => body,
  }
}

function buildOptions(overrides: Partial<ProxyOptions> = {}): ProxyOptions {
  return {
    target: 'https://remote.example.test',
    recordedDir: tmpDir,
    pathPrefix: '/gtw',
    defaultMode: 'hybrid',
    recordOnHybridMiss: true,
    ...overrides,
  }
}

function seedMock(urlPath: string, method: string): RecordedMock {
  const mock: RecordedMock = {
    hash: hashRequest({ method, path: urlPath, query: {}, body: { encoding: 'empty', data: null } }),
    recordedAt: '2026-01-01T00:00:00.000Z',
    request: { method, path: urlPath, query: {}, headers: {}, body: { encoding: 'empty', data: null } },
    response: { status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' }, body: { encoding: 'json', data: { cached: true } } },
  }
  saveMock(tmpDir, urlPath, mock)
  return mock
}

async function waitForEnd(getBody: () => unknown): Promise<void> {
  await vi.waitFor(() => {
    if (getBody() === undefined) {
      throw new Error('response not ended yet')
    }
  })
}

describe('createProxyMiddleware — control routes', () => {
  it('serves the HTML control panel on GET /__proxy__', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getStatus, getHeaders, getBody } = createRes()

    middleware(createReq({ url: '/__proxy__' }), res, () => {})
    await waitForEnd(getBody)

    expect(getHeaders()['content-type']).toContain('text/html')
    expect(getBody()).toContain('Pulse Proxy Devtools')
    expect(getStatus()).toBe(200)
  })

  it('returns the current mode and target on GET /__proxy__/mode', async () => {
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'mock' }))
    const { res, getBody } = createRes()

    middleware(createReq({ url: '/__proxy__/mode' }), res, () => {})
    await waitForEnd(getBody)

    expect(JSON.parse(String(getBody()))).toEqual({ mode: 'mock', target: 'https://remote.example.test' })
  })

  it('switches mode on POST /__proxy__/mode with a valid mode', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getBody } = createRes()

    middleware(createReq({ method: 'POST', url: '/__proxy__/mode', body: JSON.stringify({ mode: 'passthrough' }) }), res, () => {})
    await waitForEnd(getBody)

    expect(JSON.parse(String(getBody()))).toEqual({ mode: 'passthrough' })
  })

  it('rejects an invalid mode on POST /__proxy__/mode', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getStatus, getBody } = createRes()

    middleware(createReq({ method: 'POST', url: '/__proxy__/mode', body: JSON.stringify({ mode: 'nope' }) }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(400)
  })

  it('rejects a malformed JSON body on POST /__proxy__/mode', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getStatus, getBody } = createRes()

    middleware(createReq({ method: 'POST', url: '/__proxy__/mode', body: 'not-json' }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(400)
  })

  it('lists recorded mocks on GET /__proxy__/mocks', async () => {
    seedMock('/api/users', 'GET')
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getBody } = createRes()

    middleware(createReq({ url: '/__proxy__/mocks' }), res, () => {})
    await waitForEnd(getBody)

    const mocks = JSON.parse(String(getBody()))
    expect(mocks).toHaveLength(1)
    expect(mocks[0].path).toBe('/api/users')
  })

  it('deletes a recorded mock on DELETE /__proxy__/mocks', async () => {
    const mock = seedMock('/api/users', 'GET')
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getBody } = createRes()

    const query = `hash=${mock.hash}&method=GET&path=${encodeURIComponent('/api/users')}`
    middleware(createReq({ method: 'DELETE', url: `/__proxy__/mocks?${query}` }), res, () => {})
    await waitForEnd(getBody)

    expect(JSON.parse(String(getBody()))).toEqual({ deleted: true })
  })

  it('rejects DELETE /__proxy__/mocks when required query params are missing', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getStatus, getBody } = createRes()

    middleware(createReq({ method: 'DELETE', url: '/__proxy__/mocks' }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(400)
  })

  it('returns 404 for an unknown control route', async () => {
    const middleware = createProxyMiddleware(buildOptions())
    const { res, getStatus, getBody } = createRes()

    middleware(createReq({ url: '/__proxy__/unknown' }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(404)
  })
})

describe('createProxyMiddleware — pathPrefix gating', () => {
  it('calls next() and leaves the response untouched for URLs outside pathPrefix', () => {
    const middleware = createProxyMiddleware(buildOptions({ pathPrefix: '/gtw' }))
    const { res, getBody } = createRes()
    const next = vi.fn()

    middleware(createReq({ url: '/not-proxied' }), res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(getBody()).toBeUndefined()
  })
})

describe('createProxyMiddleware — mock mode', () => {
  it('serves a cached mock when one matches the request', async () => {
    seedMock('/api/users', 'GET')
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'mock', pathPrefix: '/gtw' }))
    const { res, getStatus, getHeaders, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/users' }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(200)
    expect(getHeaders()['x-proxy-source']).toBe('mock')
    expect(JSON.parse(String(getBody()))).toEqual({ cached: true })
  })

  it('returns 404 when no cached mock matches the request', async () => {
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'mock', pathPrefix: '/gtw' }))
    const { res, getStatus, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/missing' }), res, () => {})
    await waitForEnd(getBody)

    expect(getStatus()).toBe(404)
  })
})

describe('createProxyMiddleware — hybrid mode', () => {
  it('serves the cached mock without forwarding when one matches', async () => {
    seedMock('/api/users', 'GET')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'hybrid', pathPrefix: '/gtw' }))
    const { res, getHeaders, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/users' }), res, () => {})
    await waitForEnd(getBody)

    expect(getHeaders()['x-proxy-source']).toBe('mock')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards to the remote target and records the response on a cache miss', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ fresh: true }), { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'hybrid', pathPrefix: '/gtw', recordOnHybridMiss: true }))
    const { res, getHeaders, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/missing' }), res, () => {})
    await waitForEnd(getBody)

    expect(fetchMock).toHaveBeenCalledWith('https://remote.example.test/api/missing', expect.objectContaining({ method: 'GET' }))
    expect(getHeaders()['x-proxy-source']).toBe('remote')
    expect(JSON.parse(String(getBody()))).toEqual({ fresh: true })

    const recordedFile = fs.readdirSync(path.join(tmpDir, 'api', 'missing'))
    expect(recordedFile).toHaveLength(1)
  })

  it('does not record the response when recordOnHybridMiss is false', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'hybrid', pathPrefix: '/gtw', recordOnHybridMiss: false }))
    const { res, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/missing' }), res, () => {})
    await waitForEnd(getBody)

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fs.existsSync(path.join(tmpDir, 'api', 'missing'))).toBe(false)
  })
})

describe('createProxyMiddleware — passthrough mode', () => {
  it('always forwards to the remote target and records the response, even when a cache entry exists', async () => {
    seedMock('/api/users', 'GET')
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ fresh: true }), { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const middleware = createProxyMiddleware(buildOptions({ defaultMode: 'passthrough', pathPrefix: '/gtw' }))
    const { res, getHeaders, getBody } = createRes()

    middleware(createReq({ url: '/gtw/api/users' }), res, () => {})
    await waitForEnd(getBody)

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(getHeaders()['x-proxy-source']).toBe('remote')
    expect(JSON.parse(String(getBody()))).toEqual({ fresh: true })
  })
})
