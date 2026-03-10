import { api } from '../../api'
import { VITE_API_GATEWAY } from 'env-vars'
import { CguTerms, UpdateTermsResponse } from './cgu.service.types'

const CONTACT_API = 'contact/api'

export const getTermsByCurrentUser = async () => {
  const url = `${CONTACT_API}/contacts/currentuser/terms`
  const { data } = await api.gateway.get<CguTerms>(url)

  return data
}

export const updateTermsByCurrentUser = async (termsId: number) => {
  const url = `${CONTACT_API}/contacts/currentuser/terms?termsId=${termsId}`

  return await api.gateway.patch<UpdateTermsResponse>(url)
}


export const getLatestTerms = async () => {
  const url = `${CONTACT_API}/terms/latest`

  const { data } = await api.gateway.get<CguTerms['terms']>(url)

  return data
}

export const fetchUrlTerms = (
  lang: string = 'fr',
): Promise<string> =>
  Promise.resolve(`${VITE_API_GATEWAY}${CONTACT_API}/terms/latest/content?language=${lang}`)
