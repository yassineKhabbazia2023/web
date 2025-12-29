import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export type E2EPluginOptions = object

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

/**
 * Vite plugin for E2E testing with MSW
 * - Injects MSW initialization script in E2E mode
 * - Serves fixtures (env-vars.e2e.js, styles.e2e.css) when public files don't exist
 * - Serves mockServiceWorker.js from the library
 * - Serves styleguide assets (images, fonts, icons)
 * - Provides shims for external services (SignalR, PowerBI)
 */
export function e2ePlugin(_options: E2EPluginOptions = {}): Plugin {
  const isE2E = process.env.VITE_E2E_MODE === 'true'

  // Path to fixtures in this library
  const fixturesPath = path.resolve(__dirname, '../fixtures')
  const staticPath = path.resolve(__dirname, '../static')
  const shimsPath = path.resolve(__dirname, '../shims')

  // Path to the bootstrap file for direct /@fs/ access
  const bootstrapPath = path.resolve(__dirname, '../msw/bootstrap.ts')

  // Path to static assets
  const assetsPath = path.resolve(staticPath, 'assets')

  // Path to styleguide assets (for images, fonts, icons)
  const styleguideAssetsPath = path.resolve(__dirname, '../../../../libraries/styleguide/src/assets')

  // Map of public files to their E2E mock equivalents
  const e2ePublicFiles: Record<string, { file: string; contentType: string; basePath: string }> = {
    '/env-vars.js': { file: 'env-vars.e2e.js', contentType: 'application/javascript', basePath: fixturesPath },
    '/styles.css': { file: 'styles.e2e.css', contentType: 'text/css', basePath: fixturesPath },
    '/mockServiceWorker.js': { file: 'mockServiceWorker.js', contentType: 'application/javascript', basePath: staticPath },
    '/assets/sample.pdf': { file: 'sample.pdf', contentType: 'application/pdf', basePath: assetsPath },
  }

  return {
    name: 'plugin-e2e',
    config() {
      if (isE2E === false) {
        return
      }

      // Add aliases for external services shims in E2E mode
      return {
        resolve: {
          alias: {
            '@microsoft/signalr': path.resolve(shimsPath, 'signalr-shim.ts'),
            'powerbi-client': path.resolve(shimsPath, 'powerbi-shim.ts'),
            'powerbi-models': path.resolve(shimsPath, 'powerbi-models-shim.ts'),
          },
        },
      }
    },
    transformIndexHtml(html) {
      if (isE2E === false) {
        return html
      }

      // Inject MSW bootstrap script - use /@fs/ prefix for direct file access
      // Vite will transform and serve this TypeScript file
      const mswScript = `<script type="module" src="/@fs${bootstrapPath}"></script>`
      return html.replace('<head>', `<head>${mswScript}`)
    },
    configureServer(server: ViteDevServer) {
      if (isE2E === false) {
        return
      }

      // Serve E2E mock files if the public ones don't exist (CI environment)
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || ''

        // Handle specific E2E public files
        const e2eFile = e2ePublicFiles[url]
        if (e2eFile) {
          const e2eFilePath = path.join(e2eFile.basePath, e2eFile.file)

          if (fs.existsSync(e2eFilePath)) {
            res.setHeader('Content-Type', e2eFile.contentType)
            // Read binary files without encoding, text files with utf-8
            const isBinary = e2eFile.contentType.startsWith('application/') &&
              e2eFile.contentType !== 'application/javascript'
            res.end(fs.readFileSync(e2eFilePath, isBinary ? undefined : 'utf-8'))
            return
          }
        }

        // Serve styleguide assets (images, icons, fonts, etc.)
        if (url.startsWith('/assets/images/')) {
          const relativePath = url.replace('/assets/images/', '')
          const filePath = path.join(styleguideAssetsPath, 'images', relativePath)

          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase()
            const contentType = contentTypeMap[ext] || 'application/octet-stream'
            const isBinary = contentType.startsWith('image/') || contentType.startsWith('font/')
            res.setHeader('Content-Type', contentType)
            res.end(fs.readFileSync(filePath, isBinary ? undefined : 'utf-8'))
            return
          }
        }

        next()
      })
    },
  }
}
