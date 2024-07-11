import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@/common/config/services'
import {
  getCollaborators,

} from '.'

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn().mockImplementation((url) => {
        if (url === `${API_PREFIXES.WALLET}/contacts`) {
          return fetchCollabsImplementation()
        }
      }),
    },
  }),
}))

const fetchCollabsImplementation = () => {
  return vi.fn(() => {
    throw new Error('api returned 500:  failed')
  })
}

describe('getCollaborators/Admin', () => {
  it('service should return empty list', async () => {
    const errorResponse = await getCollaborators()
    expect(errorResponse).toStrictEqual({ items: [], currentPage: 1, totalPages: 1, totalItems: 0 })
  })
})
