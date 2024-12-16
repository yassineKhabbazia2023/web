import { readFile, accessSync, constants } from 'fs'
import { createServer } from 'http'
import { join, normalize, resolve, extname } from 'path'
import { logger } from '@pulse/core'

const [givenPort] = process.argv.slice(2)

const DEFAULT_PORT = 9003
const DIRECTORY_NAME = './src/assets/'

const types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
}

const root = normalize(resolve(DIRECTORY_NAME))

const server = createServer((req: any, res: any) => {
  logger.debug(`${req.method} ${req.url}`)

  const extension = extname(req.url).slice(1)
  const type = extension ? types[extension] : types.html
  const supportedExtension = Boolean(type)

  if (!supportedExtension) {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('404: File not found')
    return
  }

  let fileName = req.url
  if (req.url === '/') {
    fileName = 'index.html'
  } else if (!extension) {
    try {
      fileName = `${ req.url }.html`
      accessSync(join(root, fileName), constants.F_OK)
    } catch (e) {
      fileName = join(req.url, 'index.html')
    }
  }

  const filePath = join(root, fileName)
  const isPathUnderRoot = normalize(resolve(filePath)).startsWith(root)

  if (!isPathUnderRoot) {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('404: File not found')
    return
  }

  readFile(filePath, (err, data) => {
    if (err) {
      logger.error(`file '${filePath}' not found`)

      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('404: File not found')
    } else {
      res.writeHead(200, { 'Content-Type': type })
      res.end(data)
    }
  })
})

const port = givenPort ?? DEFAULT_PORT

server.listen(port, () => {
  logger.debug(`Server is listening on port ${port}`)
  logger.info(`you can
    add \x1b[33mVITE_ASSETS_BASE_URL: 'http://localhost:${port}/images/',\x1b[0m
    in \x1b[33m~/packages/app/public/env-vars.js\x1b[0m`)
})
