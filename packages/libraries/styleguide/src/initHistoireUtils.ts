import axios from 'axios'
import { setAssetsBaseUrl } from './utils/imageResolver'

const ENV_VARS_URL = '/env-vars.json'

const cache = {
  assetsBaseUrl: '',
}

type MetaEnv = {
  SSR: boolean
  VITE_ASSETS_BASE_URL?: string
}

export function setCachedAssetsBaseUrl(assetsBaseUrl: string) {
  cache.assetsBaseUrl = assetsBaseUrl
}

export async function getAssetsBaseUrl(metaEnv: MetaEnv) {
  if (metaEnv.SSR) {
    return
  }
  try {
    const response = await axios.get(ENV_VARS_URL)

    return response?.data?.VITE_ASSETS_BASE_URL
  } catch (e) {
    console.error(e)
  }
}

export async function getCachedAssetsBaseUrl(metaEnv: MetaEnv) {
  if (cache.assetsBaseUrl === '') {
    const assetsBaseUrl = await getAssetsBaseUrl(metaEnv) ?? metaEnv.VITE_ASSETS_BASE_URL
    setCachedAssetsBaseUrl(assetsBaseUrl)
  }
  return cache.assetsBaseUrl
}

export async function initHistoire(metaEnv: MetaEnv = import.meta.env) {
  const assetsBaseUrl = await getCachedAssetsBaseUrl(metaEnv)
  setAssetsBaseUrl(assetsBaseUrl)
}
