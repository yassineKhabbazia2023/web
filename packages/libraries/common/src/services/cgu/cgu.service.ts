import { commonApi as api } from '@pulse/common'
import { CguTerms, UpdateTermsResponse } from './cgu.service.types'

export const getTermsByCurrentUser = async () => {
  const { data } = await api().gateway.get<CguTerms>('contact/api/contacts/currentuser/terms')

  return data
}

export const updateTermsByCurrentUser = async (termsId: number) => {
  return await api().gateway.patch<UpdateTermsResponse>(`contact/api/contacts/currentuser/terms?termsId=${termsId}`)
}


export const getLatestTerms = async () => {
  const { data } = await api().gateway.get<CguTerms['terms']>('contact/api/terms/latest')

  return data
}
