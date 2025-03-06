import { commonApi as api } from '@pulse/common'

export const getTermsByCurrentUser = async (): Promise<{isCurrent:boolean, terms: {termsId: number}}> => {
  const { data } = await api().gateway.get('contact/api/contacts/currentuser/terms')
  return data
}

export const updateTermsByCurrentUser = async (
  termsId: number): Promise<{data: {message: string}}> =>
  await api().gateway.patch(`contact/api/contacts/currentuser/terms?termsId=${termsId}`)

export const getLatestTerms = async (): Promise<{ termsId: number, linkFr: string, uploadDate: string }> => {
  const { data } = await api().gateway.get('contact/api/terms/latest')
  return data
}
