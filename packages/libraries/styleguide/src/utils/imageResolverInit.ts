import { logger } from '@pulse/toolbox'

const context = {
  assetsBaseUrl: '',
}

export function getAssetsBaseUrl() {
  if (!context.assetsBaseUrl) {
    logger.warn('should initialize AssetsBaseUrl with setAssetsBaseUrl()')
    return ''
  }
  return context.assetsBaseUrl
}

export function setAssetsBaseUrl(assetsUrl: string) {
  context.assetsBaseUrl = assetsUrl
}
