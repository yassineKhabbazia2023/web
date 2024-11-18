
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

export const imageResolver = (name: string, imageList: Record<string, string>) => {
  const baseUrl = getAssetsBaseUrl()
  const filePath = imageList[name]

  return new URL(filePath, baseUrl).href
}
