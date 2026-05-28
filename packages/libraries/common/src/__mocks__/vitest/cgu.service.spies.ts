import type { Mock } from 'vitest'
import type { CguTerms } from '@common/services/cgu/cgu.service.types'
import { getTermsMock } from '../cgu.service.mocks'

export const getTermsByCurrentUserMock: Mock = vi.fn(() => Promise.resolve<CguTerms>(getTermsMock()))
export const updateTermsByCurrentUserMock: Mock = vi.fn()
export const getLatestTermsMock: Mock = vi.fn(() => Promise.resolve({ data: { termsId: 1 } }))
export const fetchUrlTermsMock: Mock = vi.fn(() => Promise.resolve('https://custom-CGU.com'))

export const cguServiceMock = {
  fetchUrlTerms: fetchUrlTermsMock,
  getTermsByCurrentUser: getTermsByCurrentUserMock,
  updateTermsByCurrentUser: updateTermsByCurrentUserMock,
  getLatestTerms: getLatestTermsMock,
}
