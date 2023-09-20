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

