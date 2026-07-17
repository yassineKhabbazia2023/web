import type { Plugin, ViteDevServer } from 'vite'
import { createProxyMiddleware } from '../proxy/middleware'
import { e2ePlugin } from './plugin.e2e'

const PROXY_ENV_KEYS = ['VITE_PROXY_ENABLED', 'VITE_PROXY_TARGET', 'VITE_PROXY_MODE', 'VITE_E2E_MODE', 'VITE_DEV_MOCKS'] as const

let savedEnv: Record<string, string | undefined>

beforeEach(() => {
  // The middleware module is spy-wrapped in vitest.setup.ts (real by default):
  // stub it per test so no real proxy middleware is ever built here.
  vi.mocked(createProxyMiddleware).mockReturnValue(vi.fn())
  // configureServer announces the mounted proxy on the dev-server console; the
  // spec drives that hook directly, so silence it to keep the run's output clean.
  vi.spyOn(console, 'log').mockImplementation(() => undefined)

  savedEnv = {}
  for (const key of PROXY_ENV_KEYS) {
    savedEnv[key] = process.env[key]
    delete process.env[key]
  }
})

afterEach(() => {
  for (const key of PROXY_ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = savedEnv[key]
    }
  }
})

function createServer(): ViteDevServer {
  return {
    middlewares: { use: vi.fn() },
    config: { base: '/', server: { port: 9000 } },
  } as unknown as ViteDevServer
}

function callConfigureServer(plugin: Plugin, server: ViteDevServer): void {
  const hook = plugin.configureServer
  const fn = (typeof hook === 'function' ? hook : hook?.handler) as ((server: ViteDevServer) => void) | undefined
  fn?.(server)
}

describe('e2ePlugin — proxy mounting (configureServer)', () => {
  it('does not mount the proxy when VITE_PROXY_ENABLED is not set', () => {
    const plugin = e2ePlugin({ app: 'customer', proxy: { target: 'https://remote.example.test' } })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).not.toHaveBeenCalled()
  })

  it('does not mount the proxy when enabled but no target is configured', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    const plugin = e2ePlugin({ app: 'customer' })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).not.toHaveBeenCalled()
  })

  it('mounts the proxy using the target and defaults from plugin options', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    const plugin = e2ePlugin({
      app: 'collaborator',
      proxy: { target: 'https://remote.example.test', pathPrefix: '/gtw', recordedDir: '/tmp/recorded', defaultMode: 'mock', recordOnHybridMiss: false },
    })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).toHaveBeenCalledWith({
      target: 'https://remote.example.test',
      recordedDir: '/tmp/recorded',
      defaultMode: 'mock',
      pathPrefix: '/gtw',
      recordOnHybridMiss: false,
    })
    expect(server.middlewares.use).toHaveBeenCalledWith(expect.any(Function))
  })

  it('gives VITE_PROXY_TARGET priority over the target configured in plugin options', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    process.env.VITE_PROXY_TARGET = 'https://override.example.test'
    const plugin = e2ePlugin({ app: 'customer', proxy: { target: 'https://remote.example.test' } })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).toHaveBeenCalledWith(expect.objectContaining({ target: 'https://override.example.test' }))
  })

  it('gives VITE_PROXY_MODE priority over the defaultMode configured in plugin options', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    process.env.VITE_PROXY_MODE = 'passthrough'
    const plugin = e2ePlugin({ app: 'customer', proxy: { target: 'https://remote.example.test', defaultMode: 'mock' } })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).toHaveBeenCalledWith(expect.objectContaining({ defaultMode: 'passthrough' }))
  })

  it('ignores an invalid VITE_PROXY_MODE and falls back to the configured defaultMode', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    process.env.VITE_PROXY_MODE = 'not-a-mode'
    const plugin = e2ePlugin({ app: 'customer', proxy: { target: 'https://remote.example.test', defaultMode: 'mock' } })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).toHaveBeenCalledWith(expect.objectContaining({ defaultMode: 'mock' }))
  })

  it('falls back to remote-first mode and the /proxy-api prefix when nothing is configured', () => {
    process.env.VITE_PROXY_ENABLED = 'true'
    const plugin = e2ePlugin({ app: 'customer', proxy: { target: 'https://remote.example.test' } })
    const server = createServer()

    callConfigureServer(plugin, server)

    expect(createProxyMiddleware).toHaveBeenCalledWith(expect.objectContaining({ defaultMode: 'remote-first', pathPrefix: '/proxy-api', recordOnHybridMiss: true }))
  })
})
