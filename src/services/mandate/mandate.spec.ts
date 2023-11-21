import { describe, it, expect, vi } from 'vitest'
import { getBankDetail } from '.'

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

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      mandate: {
        get: vi.fn((url) => {
          if (/^(bank)\/[\d]+/.test(url)) {
            return bankDetailsImplementation(url)
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
