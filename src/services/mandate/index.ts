/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

export const createMandate = async ({
  ibsNumber
}: any): Promise<any> =>
  Promise.resolve({
    data: {
      id: '140edf1b-0a59-4f70-abbc-052462faa010',
      name: 'MK 2000',
      siretNumber: '50339868700015',
      erpId: '1999072765',
      bankServicesProviderId: '',
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        address: {
          street: 'street',
          complements: 'complement',
          zipCode: 'zipcode',
          city: 'city',
          country: 'contry'
        }
      }
    }
  })

