import { getMockedBban } from '@mandate/__mocks__/mandate.mocks'
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
import type { SearchMandateParams } from './ServiceMandateTypes'

const bban = getMockedBban()

const validateIbanImplementation = ({ params }: any) => {
  const { bankCode, branchCode, accountNumber, checkDigits } = params
  if (bankCode === '14410' && branchCode === '00001' &&
    accountNumber === '12345678901' && checkDigits === '63') {
    return Promise.resolve({ data: { valid: true } })
  }
  return Promise.resolve({ data: { valid: false } })
}

const gatewayGetSpy = vi.hoisted(() => vi.fn())
const gatewayPostSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/api', () => {
  return {
    api: ({
      gateway: {
        get: gatewayGetSpy,
        post: gatewayPostSpy,
      },
    }),
  }
})

beforeEach(() => {
  gatewayGetSpy.mockResolvedValue({ data: {}, status: {} })
  gatewayPostSpy.mockResolvedValue({ data: {}, status: {} })
})

describe('getBankDetail', () => {
  it('should return bank details for a valid bank code', async () => {
    await getBankDetail('12345')
    expect(gatewayGetSpy).toHaveBeenCalledWith(
      'mandate/api/bank/12345',
    )
  })

  it('should handle errors for an invalid bank code', async () => {
    gatewayGetSpy.mockRejectedValue(new Error('Bank not found'))

    await expect(getBankDetail('12345')).rejects.toThrow('Bank not found')
  })
})

describe('downloadUnsignedMandate', () => {
  it('should return unsigned mandate', async () => {
    await downloadUnsignedMandate('e4ec92f2-a375-4574-b6de-235a9fe13028')
    expect(gatewayGetSpy)
      .toHaveBeenCalledWith('mandate/api/mandate/e4ec92f2-a375-4574-b6de-235a9fe13028/unsigned',
        { responseType: 'blob' })
  })
})

describe('downloadSignedMandate', () => {
  it('should return signed mandate', async () => {
    await downloadSignedMandate('e4ec92f2-a375-4574-b6de-235a9fe13028')
    expect(gatewayGetSpy)
      .toHaveBeenCalledWith('mandate/api/mandate/e4ec92f2-a375-4574-b6de-235a9fe13028/signed',
        { responseType: 'blob' })
  })
})

describe('terminateMandate', () => {
  it('should return signed mandate', async () => {
    const mandateId = 'e4ec92f2-a375-4574-b6de-235a9fe13028'
    await terminateMandate(mandateId)
    expect(gatewayPostSpy).toHaveBeenCalledWith(
      `mandate/api/mandate/${mandateId}/deactivate/currentuser`,
    )
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
    await getMandatesCollection(searchParams)
    const params = {
      ...searchParams,
      skip: 0,
      currentPage: undefined,
    }
    expect(gatewayGetSpy).toHaveBeenCalledWith(
      'mandate/api/mandate/currentuser',
      {
        params,
        paramsSerializer: expect.any(Function),
      },
    )
  })
})

describe('getCompany', () => {
  it('should return company data', async () => {
    const ibsNumber = '1999072765'
    await getCompany({ ibsNumber })
    expect(gatewayGetSpy).toHaveBeenCalledWith(
      `mandate/api/company/currentuser/${ibsNumber}`,
    )
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
      const validationResult = await validateIbanImplementation({
        params: { bankCode, branchCode, accountNumber, checkDigits },
      })

      gatewayGetSpy.mockResolvedValue({
        ...validationResult,
        status: 200,
      })

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
      destinationTool: 'mandate',
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
    const mandateId = '1999072765'
    const obj = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    await uploadSignedMandate({ mandateId, file: {} })
    expect(gatewayPostSpy).toHaveBeenCalledWith(
      `/mandate/api/mandate/${mandateId}/signed/currentuser`,
      expect.any(FormData),
      obj,
    )
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
