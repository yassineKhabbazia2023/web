import { describe, expect, it, vi } from 'vitest'
import { loadUserData, loadUserContext } from './router.utils'

const mockFechUserDataProvider = vi.fn()
vi.mock('@pulse/common', () => ({
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider,
  }),
}))

describe('test router.utils', () => {
  describe('loadUserData', () => {
    const store = {
      $patch: vi.fn(),
    }
    const tests = [{
      isCollab: false,
    }, {
      isCollab: true,
    }]
    it.each(tests)('', async ({
      isCollab
    }) => {
      const userMock = {
        id: 571,
        firstName: 'FirstName562',
        lastName: 'LastName169',
        isCollab,
      }
      mockFechUserDataProvider.mockResolvedValueOnce(userMock)
      const isCollabResult = await loadUserData(store)
      const expectedParams = {
        user: userMock
      }

      expect(isCollabResult).toBe(isCollab)
    })
  })  

  describe('loadUserContext', () => {
    const store = {
      $patch: vi.fn(),
    }
    it('should call loadUserData', async () => {
      const userMock = {
        id: 571,
        firstName: 'FirstName562',
        lastName: 'LastName169',
        isCollab: true,
      }
      mockFechUserDataProvider.mockResolvedValueOnce(userMock)
      await loadUserContext(store)
      const expectedParams = {
        user: userMock
      }

      expect(store.$patch).toHaveBeenCalledOnce()
      expect(store.$patch).toHaveBeenCalledWith(expectedParams)
    })
  })  
})
