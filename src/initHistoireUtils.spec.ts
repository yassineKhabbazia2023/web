import axios from 'axios'
import * as imageResolver from './utils/imageResolver'
import { beforeEach, describe, it, expect, vi, type SpyInstance } from 'vitest'
import { getAssetsBaseUrl, setCachedAssetsBaseUrl, getCachedAssetsBaseUrl, initHistoire } from './initHistoireUtils'

vi.mock('axios')
vi.mock('@/utils/logger')
const VITE_ASSETS_BASE_URL = 'https://test.test'

describe('initHistoirePlugin', () => {
  let axiosGetSpy: SpyInstance
  beforeEach(() => {
    setCachedAssetsBaseUrl('')
    axiosGetSpy = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        VITE_ASSETS_BASE_URL
      }
    })
  })

  describe('getAssetsBaseUrl', () => {
    it('should return expected url', async () => {
      const url = await getAssetsBaseUrl({ SSR: false })
      expect(url).toBe(VITE_ASSETS_BASE_URL)
    })

    it('should return undefined when axios throws an error', async () => {
      vi.spyOn(axios, 'get').mockRejectedValueOnce({})
      const url = await getAssetsBaseUrl({ SSR: false })
      expect(url).toBeUndefined()
    })

    it('should return undefined when env is SSR', async () => {
      const url = await getAssetsBaseUrl({ SSR: true })
      expect(url).toBeUndefined()
    })
  })

  describe('getCachedAssetsBaseUrl', () => {
    it('should return expected url', async () => {
      const url = await getCachedAssetsBaseUrl({ SSR: false })

      expect(url).toBe(VITE_ASSETS_BASE_URL)
    })

    it('should return default url when not provided by axios', async () => {
      const defaultUrl = 'http://default.tld'
      const url = await getCachedAssetsBaseUrl({
        SSR: true,
        VITE_ASSETS_BASE_URL: defaultUrl
      })

      expect(url).toBe(defaultUrl)
    })

    it('should call axiosGetSpy only once even when called twice', async () => {
      await getCachedAssetsBaseUrl({ SSR: false })
      await getCachedAssetsBaseUrl({ SSR: false })

      expect(axiosGetSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('initHistoire', () => {
    it('should call setAssetsBaseUrl with proper arguments', async () => {
      const setAssetsBaseUrlSpy = vi.spyOn(imageResolver, 'setAssetsBaseUrl')
      await initHistoire({ SSR: false })

      expect(setAssetsBaseUrlSpy).toHaveBeenCalledWith(VITE_ASSETS_BASE_URL)
    })

    it('should call setAssetsBaseUrl with proper arguments when using process.env', async () => {
      axiosGetSpy.mockResolvedValueOnce({})
      const setAssetsBaseUrlSpy = vi.spyOn(imageResolver, 'setAssetsBaseUrl')
      await initHistoire()

      expect(setAssetsBaseUrlSpy).toHaveBeenCalledWith(import.meta.env.VITE_ASSETS_BASE_URL)
    })
  })
})
