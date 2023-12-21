import { describe, it, expect, vi } from 'vitest'
import {
  getBankDetail,
  getMandatesCollection,
  getCompany,
  validateIban,
  createMandate,
  downloadUnsignedMandate,
  downloadSignedMandate
} from '.'
import { CreateMandateModel } from '@/components/CreateMandate/Form/FormModels'

const mandatesList = {
  counters: {
    all: 3,
    status10: 0,
    status20: 3,
    status30: 1,
    status40: 1,
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

const company = {
  id: '2ef5ff10-18d1-40b1-aa24-0fcccd8445e4',
  name: 'MK 2000',
  siretNumber: '50339868700015',
  erpId: '1999072765',
  signatory: {
    title: 'M',
    firstName: 'maroo',
    lastName: 'elleuch',
    email: 'email@email.com'
  },
  address: {
    street: '11 rue Street',
    addressComplement: 'complement',
    zipCode: '75014',
    city: 'Paris',
    country: 'France'
  }
}

const bban = {
  bankCode: '12310',
  branchCode: '02001',
  accountNumber: '12345678921',
  checkDigits: '43'
}

const bankDetailsImplementation = (url: string) => {
  if (url === 'bank/12345') {
    return Promise.resolve({
      data: {
        code: '12345',
        name: 'Banque example',
        jeDeclare: {
          jdcPartnership: 'NonPartner'
        }
      }
    })
  }
  return Promise.reject(new Error('Bank not found'))
}

const downloadUnsignedMandateImplementation = (url: string) => {
  if (url === '/mandate/e4ec92f2-a375-4574-b6de-235a9fe13028/unsigned') {
    return Promise.resolve(new Blob(['unsigned mandate blob'], { type: 'application/pdf' }))
  }
}

const downloadSignedMandateImplementation = (url: string) => {
  if (url === '/mandate/e4ec92f2-a375-4574-b6de-235a9fe13028/signed') {
    return Promise.resolve(new Blob(['signed mandate blob'], { type: 'application/pdf' }))
  }
}

const listMandatesImplementation = (url: string, filterOptions: any) => {
  if (url && filterOptions) {
    return Promise.resolve({
      data: mandatesList
    })
  }
}

const getCompanyImplementation = (url: string) => {
  if (url === '/company/1999072765') {
    return Promise.resolve({
      data: company
    })
  }
}

const validateIbanImplementation = ({ params }: any) => {
  const { bankCode, branchCode, accountNumber, checkDigits } = params
  if (bankCode === '14410' && branchCode === '00001' &&
      accountNumber === '12345678901' && checkDigits === '63') {
    return Promise.resolve({ data: { valid: true } })
  }
  return Promise.resolve({ data: { valid: false } })
}

const createImplementation = (mandate: CreateMandateModel) => {
  if (mandate) {
    return Promise.resolve({ data: { id: '3ef5ff10-18d1-40b1-aa24-0fcccd8445e6' } })
  }
}

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      mandate: {
        get: vi.fn((url, params) => {
          if (/^(bank)\/[\d]+/.test(url)) {
            return bankDetailsImplementation(url)
          }
          if (/^\/mandate\/([a-zA-Z0-9_-]+)\/unsigned$/.test(url)) {
            return downloadUnsignedMandateImplementation(url)
          }
          if (/^\/mandate\/([a-zA-Z0-9_-]+)\/signed$/.test(url)) {
            return downloadSignedMandateImplementation(url)
          }
          if (url === '/mandate') {
            return listMandatesImplementation(url, params)
          }
          if (/^(\/company)\/[\d]+/.test(url)) {
            return getCompanyImplementation(url)
          }
          if (url === 'bank/check-bban-validity') {
            return validateIbanImplementation(params)
          }
        }),
        post: vi.fn((url, body) => {
          if (body && url) {
            return createImplementation(body)
          }
        })
      }
    })
  }
})

describe('getBankDetail', () => {
  it('should return bank details for a valid bank code', async () => {
    const bankDetails = await getBankDetail('12345')
    expect(bankDetails).toStrictEqual({
      code: '12345',
      name: 'Banque example',
      jeDeclare: {
        jdcPartnership: 'NonPartner'
      }
    })
  })

  it('should handle errors for an invalid bank code', async () => {
    await expect(getBankDetail('352326')).rejects.toThrow('Bank not found')
  })
})

describe('downloadUnsignedMandate', () => {
  it('should return unsigned mandate', async () => {
    const unsignedMandate = await downloadUnsignedMandate('e4ec92f2-a375-4574-b6de-235a9fe13028')
    expect(unsignedMandate)
      .toStrictEqual(new Blob(['unsigned mandate blob'], { type: 'application/pdf' }))
  })
})

describe('downloadSignedMandate', () => {
  it('should return signed mandate', async () => {
    const unsignedMandate = await downloadSignedMandate('e4ec92f2-a375-4574-b6de-235a9fe13028')
    expect(unsignedMandate)
      .toStrictEqual(new Blob(['signed mandate blob'], { type: 'application/pdf' }))
  })
})

describe('getMandatesCollection', () => {
  it('should return mandates list', async () => {
    const { data } = await getMandatesCollection({ skip: 0, limit: 10 })
    expect(data).toStrictEqual(mandatesList)
  })
})

describe('getCompany', () => {
  it('should return company data', async () => {
    const { data } = await getCompany({ ibsNumber: '1999072765' })
    expect(data).toStrictEqual(company)
  })
})

describe('validateIban', () => {
  const ribCollection = [
    {
      bankCode: '14410',
      branchCode: '00001',
      accountNumber: '12345678901',
      checkDigits: '63',
      validity: true
    },
    {
      bankCode: '12310',
      branchCode: '02001',
      accountNumber: '12345678921',
      checkDigits: '43',
      validity: false
    }
  ]
  it.each(ribCollection)('rib $bankCode, $branchCode, $accountNumber, $checkDigits is $validity',
    async ({
      bankCode, branchCode, accountNumber, checkDigits, validity
    }) => {
      const { valid } = await validateIban({
        bankCode,
        branchCode,
        accountNumber,
        checkDigits
      })
      expect(valid).toBe(validity)
    })
})

describe('createMandate', () => {
  it('should return mandate id', async () => {
    const { data: { id } } = await createMandate({
      erpId: '1999072765',
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        email: 'email@email.com'
      },
      address: {
        street: '11 rue Street',
        addressComplement: 'complement',
        zipCode: '75014',
        city: 'Paris',
        country: 'France'
      },
      bban
    })
    expect(id).toBe('3ef5ff10-18d1-40b1-aa24-0fcccd8445e6')
  })
})
