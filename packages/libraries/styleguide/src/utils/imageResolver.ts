
const context = {
  assetsBaseUrl: '',
}

export function getAssetsBaseUrl() {
  if (!context.assetsBaseUrl) {
    console.warn('should initialize AssetsBaseUrl with setAssetsBaseUrl()')
    return ''
  }
  return context.assetsBaseUrl
}

export function setAssetsBaseUrl(assetsUrl: string) {
  context.assetsBaseUrl = assetsUrl
}

export const imageResolver = (type: string, name: string) => {
  const baseUrl = getAssetsBaseUrl()
  return new URL(`${type}/${name}.svg`, baseUrl).href
}
