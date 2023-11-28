/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { commonApi as api } from '@kpmg/common'

/**
 *
mandat vierge : GET /mandate/{mandateId}/unsigned

mandat signé : GET /mandate/{mandateId}/signed

upload d'un nouveau mandat signé: POST /mandate/{mandateId}/signed

*/
import { BbanModel, CreateMandateModel } from '@/components/CreateMandate/Form/FormModels'

// export const createMandate = async ({
export const getCompany = async ({
  ibsNumber
}: { ibsNumber: string }): Promise<any> =>
  api().mandate.get(`/company/${ibsNumber}`)

export const downloadUnsignedMandate = async (mandateId: string) => {
  return await api().mandate.get(`/mandate/${mandateId}/unsigned`, {
    responseType: 'blob'
  })
}

/* export const downloadDocumentById = async (
    { accountId, documentId }: any,
    progressCallback?: (progressEvent: ProgressEvent) => void
  ): Promise<any> => { */
export const downloadDocumentById = async (
  progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<any> => {
  /* return api().mandate.get(`/${accountId}/documents/${documentId}/content`, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent: ProgressEvent) => {
      progressCallback && progressCallback(progressEvent)
    }
  }) */
  const fileProgress: any = { loaded: 0, total: 100 }
  let intervalId: any = null
  setTimeout(() => {
    clearInterval(intervalId)
  }, 2000)
  intervalId = setInterval(() => {
    fileProgress.loaded += 25
    progressCallback && progressCallback(fileProgress)
  }, 500)
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
