import { commonApi as api } from '@kpmg/common'

export const getTermsByContactId = async (
  contactId: number): Promise<{isCurrent:boolean, terms: {termsId: number}}> => {
  const { data } = await api().gateway.get(`contact/api/contacts/${contactId}/terms`)
  return data
}

export const updateTermsByContactId = async (
  contactId: number, termsId: number): Promise<{data: {message: string}}> =>
  await api().gateway.patch(`contact/api/contacts/${contactId}/terms?termsId=${termsId}`)

