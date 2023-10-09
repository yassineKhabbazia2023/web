/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

/**
 *
mandat vierge : GET /mandate/{mandateId}/unsigned

mandat signé : GET /mandate/{mandateId}/signed

upload d'un nouveau mandat signé: POST /mandate/{mandateId}/signed

*/

export const createMandate = async ({
  ibsNumber
}: { ibsNumber: string }): Promise<any> =>
  // signature: /company/${ibsNumber}
  Promise.resolve({
    /* data: {
      id: '140edf1b-0a59-4f70-abbc-052462faa010',
      name: 'MK 2000',
      siretNumber: '50339868700015',
      erpId: ibsNumber.toString(),
      bankServicesProviderId: '',
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        address: {
          street: '5 rue de liège',
          complements: 'apt 15',
          zipCode: '75008',
          city: 'Paris',
          country: 'France'
        }
      }
    }, */
    data: {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
      name: 'JEAN LÉVAGE',
      siretNumber: '40902900600031',
      erpId: ibsNumber,
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        email: 'elleuch@email.com'
      },
      address: {
        street: 'RUE DU COMMERCE',
        addressComplement: '',
        zipCode: '59590',
        city: 'RAISMES',
        country: 'FRANCE'
      }
    }
  })

/* export const downloadDocumentById = async (
    { accountId, documentId }: any,
    progressCallback?: (progressEvent: ProgressEvent) => void
  ): Promise<any> => { */
export const downloadDocumentById = async (
  progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<any> => {
  /* return api.ds.get(`/${accountId}/documents/${documentId}/content`, {
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

export const validateIban = async (iban: string) => {
  // Simulate a delay (e.g., network request)
  // new signature: /bank/check-bban-validity
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Dummy logic: If the iban ends with an even number, consider it valid
  const isValid = parseInt(iban.slice(-1)) % 2 === 0

  return {
    valid: isValid
  }
}

export const getBankDetail = async (iban: string) => {
  // Simulate a delay (e.g., network request)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Dummy logic: If the iban ends with an even number, consider it valid
  const isScrapable = parseInt(iban.slice(-1)) === 0

  return {
    code: iban,
    name: 'Banque postale',
    jeDeclare: {
      isPartner: true,
      isScrapable
    }
  }
}

export const getMandatesCollection = async () => {
  // signature: /mandate
  return Promise.resolve({
    data: {
      counters: {
        all: 32,
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
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '40'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13029',
          erpId: '1000265309',
          companyName: 'Fleurs and co.',
          accountNumber: '66842913357',
          bankName: 'BNP Paribas',
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '20'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13030',
          erpId: '1000265310',
          companyName: 'La compagnie du voyage',
          accountNumber: '66842913358',
          bankName: 'Société Générale',
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '30'
        }
      ]
    }
  })
}
