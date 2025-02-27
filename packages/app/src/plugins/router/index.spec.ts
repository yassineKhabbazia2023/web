import { describe, expect, it, vi } from 'vitest'
import { routerBeforeEach } from './index'
import { LoginRouteName } from '@pulse/common/constants'

const mockedGatewayGet = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  createWebHistory: vi.fn(),
  createRouter: () => ({
    addRoute: vi.fn(),
    beforeEach: vi.fn(),
  }),
}))
vi.mock('@pulse/common', () => ({
  commonStore: vi.fn(),
  commonApi: () => ({
    gateway: {
      get: mockedGatewayGet,
    },
  }),
  dataProvider: vi.fn(),
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
    const store = {}
    mockedGatewayGet.mockResolvedValue({
      data: userOrigin,
    })
    const response = await routerBeforeEach(
      to,
      store,
      isAuthenticated,
      isCollab,
    )
    if (expectedResponse) {
      expect(response).toStrictEqual(expectedResponse)
    } else {
      expect(response).toBeUndefined()
    }
  })
})
