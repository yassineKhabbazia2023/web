import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import type { E2EPluginOptions } from '../types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Content type mapping for common file extensions
const contentTypeMap: Record<string, string> = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

interface E2EFileMapping {
  file: string
  contentType: string
  basePath: string
}

function normalizeUrl(url: string, base: string): string {
  if (base !== '/' && url.startsWith(base)) {
    return '/' + url.slice(base.length)
  }
  return url
}

function serveFile(res: ServerResponse, filePath: string, contentType: string, binary: boolean): boolean {
  if (fs.existsSync(filePath) === false) {
    return false
  }
  res.setHeader('Content-Type', contentType)
  res.end(fs.readFileSync(filePath, binary ? undefined : 'utf-8'))
  return true
}

function serveServiceWorker(url: string, normalizedUrl: string, staticFilesPath: string, res: ServerResponse): boolean {
  if (normalizedUrl !== '/mockServiceWorker.js' && url !== '/mockServiceWorker.js') {
    return false
  }
  return serveFile(res, path.join(staticFilesPath, 'mockServiceWorker.js'), 'application/javascript', false)
}

// Same-origin signing page embedded in the SEPA mandate iframe. It must be served by the dev server
// (not MSW, whose service worker bypasses iframe navigation requests). Its "Signer" button calls the
// MSW-mocked /mock/getaccept-sign endpoint to mark the mandate as signed for the next preference read.
function serveGetAcceptMockPage(
  url: string,
  normalizedUrl: string,
  staticFilesPath: string,
  res: ServerResponse,
): boolean {
  const requestPath = url.split('?')[0]
  if (normalizedUrl !== '/mock/getaccept-signature' && requestPath !== '/mock/getaccept-signature') {
    return false
  }
  return serveFile(res, path.join(staticFilesPath, 'getaccept-signature.html'), 'text/html', false)
}

function serveE2EFixture(
  url: string,
  normalizedUrl: string,
  publicFiles: Record<string, E2EFileMapping>,
  res: ServerResponse,
): boolean {
  const e2eFile = publicFiles[normalizedUrl] || publicFiles[url]
  if (e2eFile === undefined) {
    return false
  }
  const isBinary = e2eFile.contentType.startsWith('application/') &&
    e2eFile.contentType !== 'application/javascript'
  return serveFile(res, path.join(e2eFile.basePath, e2eFile.file), e2eFile.contentType, isBinary)
}

function serveStyleguideAsset(normalizedUrl: string, assetsBasePath: string, res: ServerResponse): boolean {
  if (normalizedUrl.startsWith('/assets/images/') === false) {
    return false
  }
  const relativePath = normalizedUrl.replaceAll('/assets/images/', '')
  const filePath = path.join(assetsBasePath, 'images', relativePath)
  const contentType = contentTypeMap[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
  const isBinary = contentType.startsWith('image/') || contentType.startsWith('font/')
  return serveFile(res, filePath, contentType, isBinary)
}

/**
 * Vite plugin for E2E testing with MSW
 * - Injects MSW initialization script in E2E mode
 * - Serves fixtures (env-vars.e2e.js, styles.e2e.css) when public files don't exist
 * - Serves mockServiceWorker.js from the library
 * - Serves styleguide assets (images, fonts, icons)
 * - Provides shims for external services (SignalR, PowerBI)
 */
export function e2ePlugin(options: E2EPluginOptions = {}): Plugin {
  const isE2E = process.env.VITE_E2E_MODE === 'true'
  const isDevMocks = process.env.VITE_DEV_MOCKS === 'true'
  const appType = options.app || 'customer'

  // Path to fixtures in this library
  const fixturesPath = path.resolve(__dirname, '../fixtures')
  const staticPath = path.resolve(__dirname, '../static')
  const shimsPath = path.resolve(__dirname, '../shims')

  // Path to the bootstrap file for direct /@fs/ access
  const bootstrapPath = path.resolve(__dirname, '../msw/bootstrap.ts')

  // Path to the dev-mocks bootstrap file
  const devMocksBootstrapPath = path.resolve(__dirname, '../dev-mocks/bootstrap.ts')

  // Path to static assets
  const assetsPath = path.resolve(staticPath, 'assets')

  // Path to styleguide assets (for images, fonts, icons)
  const styleguideAssetsPath = path.resolve(__dirname, '../../../../libraries/styleguide/src/assets')

  // Select env-vars file based on app type
  const envVarsFile = appType === 'backoffice' ? 'env-vars.backoffice.e2e.js' : 'env-vars.e2e.js'

  // Map of public files to their E2E mock equivalents
  const e2ePublicFiles: Record<string, E2EFileMapping> = {
    '/env-vars.js': { file: envVarsFile, contentType: 'application/javascript', basePath: fixturesPath },
    '/styles.css': { file: 'styles.e2e.css', contentType: 'text/css', basePath: fixturesPath },
    '/mockServiceWorker.js': { file: 'mockServiceWorker.js', contentType: 'application/javascript', basePath: staticPath },
    '/assets/sample.pdf': { file: 'sample.pdf', contentType: 'application/pdf', basePath: assetsPath },
  }

  // Resolved base path from Vite config (set by configResolved hook)
  let resolvedBase = '/'

  return {
    name: 'plugin-e2e',
    configResolved(config) {
      resolvedBase = config.base
    },
    config() {
      if (isE2E === false) {
        return
      }

      // Base aliases for external services shims in E2E mode
      const aliases: Record<string, string> = {
        '@microsoft/signalr': path.resolve(shimsPath, 'signalr-shim.ts'),
        'powerbi-client': path.resolve(shimsPath, 'powerbi-shim.ts'),
        'powerbi-models': path.resolve(shimsPath, 'powerbi-models-shim.ts'),
        '@amplitude/analytics-browser': path.resolve(shimsPath, 'amplitude-shim.ts'),
        '@amplitude/plugin-session-replay-browser': path.resolve(shimsPath, 'amplitude-session-replay-shim.ts'),
      }

      // Add MSAL shim for apps using MSAL SSO (collaborator and backoffice)
      if (appType === 'collaborator' || appType === 'backoffice') {
        aliases['@azure/msal-browser'] = path.resolve(shimsPath, 'msal-shim.ts')
      }

      return {
        resolve: {
          alias: aliases,
        },
      }
    },
    transformIndexHtml(html) {
      if (isE2E) {
        // Inject MSW app type and bootstrap script
        // The inline script sets the app type before the bootstrap module loads
        const appTypeScript = `<script>window.__MSW_APP_TYPE__ = '${appType}';</script>`
        // Use /@fs/ prefix for direct file access - Vite will transform and serve this TypeScript file
        // Prefix with resolvedBase so the path works with non-root base paths (e.g. /collaborateur/)
        const mswScript = `<script type="module" src="${resolvedBase}@fs${bootstrapPath}"></script>`
        return html.replace('<head>', `<head>${appTypeScript}${mswScript}`)
      }

      if (isDevMocks) {
        // Inject only the dev-mocks bootstrap — no shims, no env-var overrides
        const mswScript = `<script type="module" src="${resolvedBase}@fs${devMocksBootstrapPath}"></script>`
        return html.replace('<head>', `<head>${mswScript}`)
      }

      return html
    },
    configureServer(server: ViteDevServer) {
      if (isE2E === false && isDevMocks === false) {
        return
      }

      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || ''
        const base = server.config.base || '/'
        const normalizedUrl = normalizeUrl(url, base)

        if (serveServiceWorker(url, normalizedUrl, staticPath, res)) {
          return
        }
        if (serveGetAcceptMockPage(url, normalizedUrl, staticPath, res)) {
          return
        }
        if (isE2E === true && serveE2EFixture(url, normalizedUrl, e2ePublicFiles, res)) {
          return
        }
        if (isE2E === true && serveStyleguideAsset(normalizedUrl, styleguideAssetsPath, res)) {
          return
        }

        next()
      })
    },
  }
}
