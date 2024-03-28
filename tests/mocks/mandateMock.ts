import type { BbanModel } from '@/components/CreateMandate/Form/FormModels'

export function getMockedMandatesList(override = {}) {
  const defaultMandateList = {
    counters: {
      all: 3,
      status10: 0,
      status20: 3,
      status30: 1,
      status40: 1,
      status50: 0,
    },
    data: getMockedMandatesData(),
  }

  return {
    ...defaultMandateList,
    ...override,
  }
}

export function getMockedMandatesData() {
  const data = [
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
      erpId: '1000265308',
      companyName: 'Boulangerie du canal',
      accountNumber: '66842913356',
      bankName: 'Crédit Agricole',
      creationDate: '2023-08-14T13:12:31.926Z',
      modificationDate: '2023-08-14T13:12:31.926Z',
      statusCode: '40',
    },
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13029',
      erpId: '1000265309',
      companyName: 'Fleurs and co.',
      accountNumber: '66842913357',
      bankName: 'BNP Paribas',
      creationDate: '2023-08-14T13:12:31.926Z',
      modificationDate: '2023-08-14T13:12:31.926Z',
      statusCode: '20',
    },
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13030',
      erpId: '1000265310',
      companyName: 'La compagnie du voyage',
      accountNumber: '66842913358',
      bankName: 'Société Générale',
      creationDate: '2023-08-14T13:12:31.926Z',
      modificationDate: '2023-08-14T13:12:31.926Z',
      statusCode: '30',
    },
  ]

  return data
}
export function getMockedCompany(override = {}) {
  const defaultCompany = {
    id: '2ef5ff10-18d1-40b1-aa24-0fcccd8445e4',
    name: 'MK 2000',
    siretNumber: '50339868700015',
    erpId: '1999072765',
    signatory: {
      title: 'M',
      firstName: 'maroo',
      lastName: 'elleuch',
      email: 'email@email.com',
    },
    address: {
      street: '11 rue Street',
      addressComplement: 'complement',
      zipCode: '75014',
      city: 'Paris',
      country: 'France',
    },
  }
  return {
    ...defaultCompany,
    ...override,
  }
}

export function getMockedBban(override: Partial<BbanModel> = {}): BbanModel {
  const defaultBban: BbanModel = {
    bankCode: '12310',
    branchCode: '02001',
    accountNumber: '12345678921',
    checkDigits: '43',
  }
  return {
    ...defaultBban,
    ...override,
  }
}
