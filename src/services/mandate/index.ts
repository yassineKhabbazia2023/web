/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

export const createMandate = async ({
  ibsNumber
}: any): Promise<any> =>
  Promise.resolve({
    data: {
      raisonSociale: 'La patisserie Julio CURIE',
      siret: '123456',
      signatory: {
        civility: 'M',
        firstName: 'seif allah',
        lastName: 'medini',
        email: 'seifallah@gmail.com',
        address: {
          street: 'RUE DU COMMERCE',
          complements: '',
          zipCode: '59590',
          city: 'RAISMES',
          country: 'FRANCE'
        }
      }
    }
  })

