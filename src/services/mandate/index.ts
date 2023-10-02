/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

export const createMandate = async ({
  ibsNumber
}: { ibsNumber: string }): Promise<any> =>
  Promise.resolve({
    data: {
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
