import { commonApi as api } from '@kpmg/common'

/**
 *
upload d'un nouveau mandat signé: POST /mandate/{mandateId}/signed
*/
import { BbanModel, CreateMandateModel } from '@/components/CreateMandate/Form/FormModels'

export const getCompany = async ({
  ibsNumber
}: { ibsNumber: string }): Promise<any> =>
  api().mandate.get(`/company/${ibsNumber}`)

export const downloadUnsignedMandate = async (mandateId: string) => {
  return await api().mandate.get(`/mandate/${mandateId}/unsigned`, {
    responseType: 'blob'
  })
}

export const downloadSignedMandate = async (mandateId: string) => {
  return await api().mandate.get(`/mandate/${mandateId}/signed`, {
    responseType: 'blob'
  })
}

export const terminateMandate = async (mandateId: string) => {
  return await api().mandate.post(`/mandate/${mandateId}/deactivate`)
}

export const validateIban = async ({
  bankCode,
  branchCode,
  accountNumber,
  checkDigits
}: BbanModel) => {
  const { data: { valid } } = await api().mandate.get(
    'bank/check-bban-validity',
    { params: { bankCode, branchCode, accountNumber, checkDigits } }
  )
  return {
    valid
  }
}

export const getBankDetail = async (bankCode: string) => {
  const { data } = await api().mandate.get(
    `bank/${bankCode}`)
  return data
}

export const getMandatesCollection = async ({
  skip = 0, limit = 10, searchTerm = '', creationDateStart = '',
  creationDateEnd = '',
  modificationDateStart = '', modificationDateEnd = '',
  statusCodes = [], sortCriteria = '', sortOrder = 'Descending'
} = {}) => {
  return api().mandate.get('/mandate', {
    params:
    {
      skip,
      limit,
      searchTerm,
      creationDateStart,
      creationDateEnd,
      modificationDateStart,
      modificationDateEnd,
      statusCodes,
      sortCriteria,
      sortOrder
    }
  })
}

export const createMandate = async ({
  erpId,
  signatory,
  address,
  bban
}: CreateMandateModel): Promise<any> =>
  api().mandate.post('/mandate', { erpId, signatory, address, bban })
