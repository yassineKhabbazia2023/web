import { describe, expect, it, vi } from 'vitest'
import { LoginRouteName } from '@pulse/common/constants'
import { getStoreMock, getMockedUser, getMockedEntities } from '@pulse/common/mocks'
import { useUserStore, useTokenStore, useSelectedEntityStore } from '@pulse/common/stores'

import { routerBeforeEach, entityClientOrHomeRedirections } from '.'

getStoreMock(useUserStore)
getStoreMock(useTokenStore)
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

const mockedGatewayGet = vi.hoisted(() => vi.fn())

const fetchEntitiesMock = vi.hoisted(() => vi.fn())
vi.mock('@app/services/entities', () => ({
  fetchEntities: fetchEntitiesMock,
}))

vi.mock('vue-router', () => ({
  createWebHistory: vi.fn(),
  createRouter: () => ({
    addRoute: vi.fn(),
    beforeEach: vi.fn(),
  }),
}))

const userMock = getMockedUser()

const mockFechUserDataProvider = vi.fn(() => {
  return Promise.resolve(userMock)
})

const checkAuthenticatedUserMock = vi.hoisted(() => vi.fn())
vi.mock('./router.utils', () => ({
  checkAuthenticatedUser: checkAuthenticatedUserMock,
}))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockedGatewayGet,
    },
  }),
  dataProvider: () => ({
    fetchUserData: mockFechUserDataProvider,
  }),
}))

describe('router', () => {
  const tests = [{
    toName: LoginRouteName.LOGIN_COLLAB,
    userOrigin: 'CLIENT',
    isAuthenticated: false,
    isCollab: false,
    expectedResponse: {
      name: 'loginClient',
    },
  }, {
    toName: '',
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: false,
    expectedResponse: undefined,
  }, {
    toName: LoginRouteName.LOGIN_COLLAB,
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: false,
    expectedResponse: {
      name: 'entity-client',
    },
  }, {
    toName: LoginRouteName.LOGIN_COLLAB,
    userOrigin: 'COLLAB',
    isAuthenticated: false,
    isCollab: true,
    expectedResponse: {
      name: LoginRouteName.LOGIN_COLLAB,
    },
  }, {
    toName: LoginRouteName.LOGIN_COLLAB,
    userOrigin: 'CLIENT',
    isAuthenticated: false,
    isCollab: true,
    expectedResponse: {
      name: LoginRouteName.LOGIN_CLIENT,
    },
  }, {
    toName: '',
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: true,
    expectedResponse: undefined,
  }, {
    toName: LoginRouteName.LOGIN_COLLAB,
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: true,
    expectedResponse: {
      name: 'wallet',
    },
  }, {
    toName: 'mandats',
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: true,
    expectedResponse: undefined,
  }, {
    toName: 'folderMandats',
    userOrigin: 'CLIENT',
    isAuthenticated: true,
    isCollab: true,
    expectedResponse: undefined,
  }]
  it.each(tests)('should return expectedResponse when userOrigin = $userOrigin, to.name = $toName, isAuthenticated = $isAuthenticated and isCollab = $isCollab', async ({
    toName,
    userOrigin,
    isAuthenticated,
    isCollab,
    expectedResponse,
  }) => {
    const to = {
      meta: {},
      name: toName,
    }
    mockedGatewayGet.mockResolvedValue({
      data: userOrigin,
    })
    const response = await routerBeforeEach({
      to,
      isAuthenticated,
      isCollab,
      isFirstTime: false,
    })
    if (expectedResponse) {
      expect(response).toStrictEqual(expectedResponse)
    } else {
      expect(response).toBeUndefined()
    }
  })

  it('should call store.$patch when is firstTime is true', async () => {
    const toName = 'folderMandats'
    const userOrigin = 'CLIENT'
    const isAuthenticated = true
    const isCollab = true
    const isFirstTime = true

    const to = {
      meta: {},
      name: toName,
    }
    mockedGatewayGet.mockResolvedValue({
      data: userOrigin,
    })
    const response = await routerBeforeEach({
      to,
      isAuthenticated,
      isCollab,
      isFirstTime,
    })
    expect(response).toBeUndefined()
    expect(checkAuthenticatedUserMock).toHaveBeenCalledOnce()
    expect(checkAuthenticatedUserMock).toHaveBeenCalledWith(/* no argument expected */)
  })

  describe('entityClientOrHomeRedirections', () => {
    const entitiesMock = getMockedEntities()
    describe('when isCollab is false', () => {
      const isCollab = false
      const tests = [{
        toName: '',
        totalItems: 1,
        expectedRedirection: undefined,
        expectedSetSelectedEntityCalledTimes: 0,
      }, {
        toName: 'home',
        totalItems: 0,
        expectedRedirection: undefined,
        expectedSetSelectedEntityCalledTimes: 0,
      }, {
        toName: 'home',
        totalItems: 1,
        expectedRedirection: {
          name: 'entity-client',
        },
        expectedSetSelectedEntityCalledTimes: 0,
      }, {
        toName: 'entity-client',
        totalItems: 1,
        expectedRedirection: {
          name: 'folder',
          params: {
            id: 1,
          },
        },
        expectedSetSelectedEntityCalledTimes: 1,
      }, {
        toName: 'entity-client',
        totalItems: 2,
        expectedRedirection: undefined,
        expectedSetSelectedEntityCalledTimes: 0,
      }]
      it.each(tests)('should return $expectedRedirection when toName equals $toName and totalItems equals $totalItems', async ({
        toName,
        totalItems,
        expectedRedirection,
        expectedSetSelectedEntityCalledTimes,
      }) => {
        const entitiesPaginationMock = {
          items: entitiesMock,
          totalItems,
        }

        fetchEntitiesMock.mockResolvedValue(entitiesPaginationMock)
        const redirection = await entityClientOrHomeRedirections(toName, isCollab)

        expect(redirection).toStrictEqual(expectedRedirection)
        expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledTimes(expectedSetSelectedEntityCalledTimes)
        if (expectedSetSelectedEntityCalledTimes) {
          const expectedSelectedEntity = {
            ...entitiesMock.at(0),
            color: 'persian',
          }
          expect(selectedEntityStoreMock.setSelectedEntity).toHaveBeenCalledWith(expectedSelectedEntity)
        }
      })
    })
    describe('when isCollab is true', () => {
      const isCollab = true
      const tests = [{
        toName: '',
        totalItems: 1,
        expectedRedirection: undefined,
      }, {
        toName: 'home',
        totalItems: 0,
        expectedRedirection: {
          name: 'wallet',
        },
      }, {
        toName: 'home',
        totalItems: 1,
        expectedRedirection: {
          name: 'wallet',
        },
      }, {
        toName: 'entity-client',
        totalItems: 1,
        expectedRedirection: undefined,
      }, {
        toName: 'entity-client',
        totalItems: 2,
        expectedRedirection: undefined,
      }]
      it.each(tests)('should return $expectedRedirection when toName equals $toName and totalItems equals $totalItems', async ({
        toName,
        totalItems,
        expectedRedirection,
      }) => {
        const entitiesPaginationMock = {
          items: entitiesMock,
          totalItems,
        }

        fetchEntitiesMock.mockResolvedValue(entitiesPaginationMock)
        const redirection = await entityClientOrHomeRedirections(toName, isCollab)

        expect(redirection).toStrictEqual(expectedRedirection)
        expect(selectedEntityStoreMock.setSelectedEntity).not.toHaveBeenCalled()
      })
    })
  })
})
