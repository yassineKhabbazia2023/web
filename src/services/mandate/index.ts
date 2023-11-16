/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { commonApi as api } from '@kpmg/common'

/**
 *
mandat vierge : GET /mandate/{mandateId}/unsigned

mandat signé : GET /mandate/{mandateId}/signed

upload d'un nouveau mandat signé: POST /mandate/{mandateId}/signed

*/
import { BbanModel } from '@/components/CreateMandate/Form/FormModels'

export const createMandate = async ({
  ibsNumber
}: { ibsNumber: string }): Promise<any> =>
  api().mandate.get(`/company/${ibsNumber}`)

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

export const getBankDetail = async (iban: string) => {
  // Simulate a delay (e.g., network request)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Dummy logic: If the iban ends with an even number, consider it valid
  const isScrapable = parseInt(iban.slice(-1)) === 0

  /* const { data: valid } = await api().mandate.get(
    `bank/${bankCode}`) */
  /* {
      "code": "12345",
      "name": "Banque postale",
      "jeDeclare": {
        "isPartner": true,
        "isScrapable": true
      }
    } */

  return {
    code: iban,
    name: 'Banque postale',
    jeDeclare: {
      isPartner: true,
      isScrapable
    }
  }
}

/* export const getMandatesCollection = async ({
  skip = 0, limit = 10, searchTerm = '', creationDateStart = '',
  creationDateEnd = '',
  modificationDateStart = '', modificationDateEnd = '',
  statusCodes = [], sortCriteria = '', sortOrder = 'Descending', apiConnected = false
} = {}) */
export const getMandatesCollection = async () => {
  // signature: /mandate
  return Promise.resolve({
    data: {
      counters: {
        all: 33,
        status10: 1,
        status20: 3,
        status30: 4,
        status40: 24,
        status50: 0
      },
      data: [
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
          erpId: '1000265308',
          companyName: 'Boulangerie du canal',
          accountNumber: '66842913356',
          bankName: 'Crédit Agricole',
          creationDate: '2022-04-14T13:12:31.926Z',
          modificationDate: '2023-09-17T13:12:31.926Z',
          statusCode: '40'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13029',
          erpId: '1000265309',
          companyName: 'Fleurs and co.',
          accountNumber: '66842913357',
          bankName: 'BNP Paribas',
          creationDate: '2021-09-14T13:12:31.926Z',
          modificationDate: '2023-08-17T13:12:31.926Z',
          statusCode: '20'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13030',
          erpId: '1000265310',
          companyName: 'La compagnie du voyage',
          accountNumber: '66842913358',
          bankName: 'Société Générale',
          creationDate: '2020-08-14T13:12:31.926Z',
          modificationDate: '2023-06-11T13:12:31.926Z',
          statusCode: '30'
        }
      ]
    }
  })
}
