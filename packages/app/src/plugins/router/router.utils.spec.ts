import { describe, expect, it, vi } from 'vitest'
import { cguServiceMock, getTermsMock } from '@pulse/common/mocks'
import { loadUserData, checkAuthenticatedUser, checkCgu } from './router.utils'
import { LoginRouteName } from '@pulse/common/constants'

const mockFechUserDataProvider = vi.fn()
vi.mock('@pulse/common', () => ({
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider,
  }),
}))

vi.mock('@pulse/common/services/cgu', () => cguServiceMock)

const termMockIsCurrent = getTermsMock({
  isCurrent: true,
})
const termMockIsNotCurrent = getTermsMock({
  isCurrent: false,
})

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
    it.each(tests)('should return $isCollab', async ({
      isCollab,
    }) => {
      const userMock = {
        id: 571,
        firstName: 'FirstName562',
        lastName: 'LastName169',
        isCollab,
      }
      mockFechUserDataProvider.mockResolvedValueOnce(userMock)
      const isCollabResult = await loadUserData(store)

      expect(isCollabResult).toBe(isCollab)
    })
  })

  describe('checkCgu', () => {
    const tests = [{
      termMock: termMockIsCurrent,
      expectedRedirection: undefined,
    }, {
      termMock: termMockIsNotCurrent,
      expectedRedirection: {
        name: LoginRouteName.CGU_VALIDATION,
        params: {
          termsId: termMockIsNotCurrent.terms.termsId,
        },
      },
    }]

    it.each(tests)('should return undefined when getTermsByCurrentUser returns isCurrent = true', async ({
      termMock,
      expectedRedirection,
    }) => {
      cguServiceMock.getTermsByCurrentUser.mockResolvedValueOnce(termMock)
      const redirection = await checkCgu()

      if (expectedRedirection) {
        expect(redirection).toStrictEqual(expectedRedirection)
      } else {
        expect(redirection).toBeUndefined()
      }
    })
  })

  describe('checkAuthenticatedUser', () => {
    const store = {
      $patch: vi.fn(),
    }
    const basicUserMock = {
      id: 571,
      firstName: 'FirstName562',
      lastName: 'LastName169',
    }

    it('should return undefined and should NOT call getTermsByCurrentUser when isCollab is true', async () => {
      const userMock = {
        ...basicUserMock,
        isCollab: true,
      }
      const expectedParams = {
        user: userMock,
      }

      mockFechUserDataProvider.mockResolvedValueOnce(userMock)
      const redirection = await checkAuthenticatedUser(store)

      expect(redirection).toBeUndefined()
      expect(store.$patch).toHaveBeenCalledOnce()
      expect(store.$patch).toHaveBeenCalledWith(expectedParams)
      expect(cguServiceMock.getTermsByCurrentUser).not.toHaveBeenCalledOnce()
    })

    it('should call getTermsByCurrentUser and return redirection when isCollab is false', async () => {
      const userMock = {
        ...basicUserMock,
        isCollab: false,
      }
      const expectedParams = {
        user: userMock,
      }
      const expectedRedirection = {
        name: LoginRouteName.CGU_VALIDATION,
        params: {
          termsId: termMockIsNotCurrent.terms.termsId,
        },
      }

      mockFechUserDataProvider.mockResolvedValueOnce(userMock)
      cguServiceMock.getTermsByCurrentUser.mockResolvedValueOnce(termMockIsNotCurrent)

      const redirection = await checkAuthenticatedUser(store)

      expect(redirection).toStrictEqual(expectedRedirection)
      expect(store.$patch).toHaveBeenCalledOnce()
      expect(store.$patch).toHaveBeenCalledWith(expectedParams)
      expect(cguServiceMock.getTermsByCurrentUser).toHaveBeenCalledOnce()
    })
  })
})
