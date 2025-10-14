import { VITE_API_GATEWAY } from 'env-vars'

export const fetchUrlTerms = (
  lang: string = 'fr',
): Promise<string> =>
  Promise.resolve(`${VITE_API_GATEWAY}contact/api/terms/latest/content?language=${lang}`)

export * from './widgets'
