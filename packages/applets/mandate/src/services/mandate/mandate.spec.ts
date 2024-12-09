import { describe, it, expect, vi } from 'vitest'
import {
  getBankDetail,
  getMandatesCollection,
  getCompany,
  validateIban,
  createMandate,
  downloadUnsignedMandate,
  downloadSignedMandate,
  uploadSignedMandate,
  terminateMandate,
  parseParams,
  getMandateAvailability,
} from '.'
import type { CreateMandateModel } from '@mandate/components/CreateMandate/Form/FormModels'
import { getMockedMandatesList, getMockedCompany, getMockedBban } from '@mandate/../tests/mocks/mandateMock'
import type { SearchMandateParams } from './ServiceMandateTypes'

const mandatesList = getMockedMandatesList()
const company = getMockedCompany()
const bban = getMockedBban()

const bankDetailsImplementation = (url: string) => {
  if (url === 'bank/12345') {
    return Promise.resolve({
      data: {
        code: '12345',
        name: 'Banque example',
        jeDeclare: {
          jdcPartnership: 'NonPartner',
        },
      },
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

const terminateMandateImplementation = (url: string) => {
  if (url === '/mandate/e4ec92f2-a375-4574-b6de-235a9fe13028/deactivate') {
    return Promise.resolve({})
  }
}

const listMandatesImplementation = (url: string, filterOptions: any) => {
  if (url && filterOptions) {
    return Promise.resolve({
      data: mandatesList,
    })
  }
}

const getCompanyImplementation = (url: string) => {
  if (url === '/company/1999072765') {
    return Promise.resolve({
      data: company,
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

const gatewayGetSpy = vi.fn(() => {
  return Promise.resolve({ data: {}, status: {} })
})
const gatewayPostSpy = vi.fn(() => {
  return Promise.resolve({ data: {}, status: {} })
})

vi.mock('@pulse/common', () => {
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
          if (/^\/mandate\/([a-zA-Z0-9_-]+)\/deactivate$/.test(url)) {
            return terminateMandateImplementation(url)
          }
        }),
      },
      gateway: {
        get: gatewayGetSpy,
        post: gatewayPostSpy,
      },
    }),
  }
})

describe('getBankDetail', () => {
  it('should return bank details for a valid bank code', async () => {
    const bankDetails = await getBankDetail('12345')
    expect(bankDetails).toStrictEqual({
      code: '12345',
      name: 'Banque example',
      jeDeclare: {
        jdcPartnership: 'NonPartner',
      },
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

describe('terminateMandate', () => {
  it('should return signed mandate', async () => {
    const terminateMandateResult = await terminateMandate('e4ec92f2-a375-4574-b6de-235a9fe13028')
    expect(terminateMandateResult)
      .toStrictEqual({})
  })
})

describe('getMandatesCollection', () => {
  it('should return mandates list', async () => {
    const searchParams: SearchMandateParams = {
      currentPage: 1,
      limit: 10,
      searchTerm: '',
      creationDateStart: '',
      creationDateEnd: '',
      modificationDateStart: '',
      modificationDateEnd: '',
      statusCodes: [],
      sortCriteria: '',
      sortOrder: 'Descending',
    }
    const { data } = await getMandatesCollection(searchParams)
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
      validity: true,
    },
    {
      bankCode: '12310',
      branchCode: '02001',
      accountNumber: '12345678921',
      checkDigits: '43',
      validity: false,
    },
  ]
  it.each(ribCollection)('rib $bankCode, $branchCode, $accountNumber, $checkDigits is $validity',
    async ({
      bankCode, branchCode, accountNumber, checkDigits, validity,
    }) => {
      const { valid } = await validateIban({
        bankCode,
        branchCode,
        accountNumber,
        checkDigits,
      })
      expect(valid).toBe(validity)
    })
})

describe('createMandate', () => {
  it('should return mandate id', async () => {
    const requestBody = {
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
      bban,
    }

    await createMandate(requestBody)
    expect(gatewayPostSpy).toHaveBeenCalledWith(
      'mandate/api/mandate/currentuser',
      requestBody,
    )
  })
})

describe('uploadSignedMandate', () => {
  it('should return mandate id', async () => {
    const { data: { id } } = await uploadSignedMandate({ mandateId: '1999072765', file: {} })
    expect(id).toBe('3ef5ff10-18d1-40b1-aa24-0fcccd8445e6')
  })
})

describe('parseParams', () => {
  it('should return parsed params', () => {
    const params: Record<string, any> = {
      a: '0',
      b: ['1', '2', 3],
    }
    const expectedParsedParams = 'a=0&b=1&b=2&b=3'
    const parsedParams = parseParams(params)

    expect(parsedParams).toBe(expectedParsedParams)
  })
})

describe('mandate availability', () => {
  it('should fetch mandate availability status', async () => {
    const mandateId = '1234'
    await getMandateAvailability(mandateId)

    expect(gatewayGetSpy).toHaveBeenCalledWith(`mandate/api/mandate/${mandateId}/check/status`)
  })
})
