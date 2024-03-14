import { fetchUserEntityServices } from './Services'
import { describe, it, expect, vi } from 'vitest'

const mockPortalGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      value: 'test',
    },
  })
})

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    portal: {
      get: mockPortalGet,
    },
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

describe('fetchUserEntityServices', () => {
  it('should return folder object', async () => {
    const folder = await fetchUserEntityServices('serviceId')
    expect(mockPortalGet).toHaveBeenCalledTimes(1)
    expect(mockPortalGet).toHaveBeenCalledWithExactlyOnceWith('GetUserServicesByAccountId?accountId=serviceId')
    expect(folder).toBe('test')
  })
})
