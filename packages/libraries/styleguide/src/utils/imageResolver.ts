import { getAssetsBaseUrl } from './imageResolverInit'

export const imageResolver = (name: string, imageList: Record<string, string>) => {
  const baseUrl = getAssetsBaseUrl()
  const filePath = imageList[name]

  return new URL(filePath, baseUrl).href
}
