import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { getMockedEntities, getMockedUserPermissions } from '../mocks'
import commonStore from './index'
import { tokenService } from '../main.mts'

const mockedEntities = getMockedEntities()
const mockedPermissions = getMockedUserPermissions()

const pinia = createTestingPinia({
  initialState: {
    user: null,
  },
  stubActions: false,
})

const mockGetPermissions = vi.fn((_url) => {
  return Promise.resolve({
    data: mockedPermissions,
  })
})

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      get: mockGetPermissions,
    },
  }),
}))

describe('commonStore', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  const IS_COLLAB = [true, false]

  it('initializes user as Jean Levage', () => {
    const store = commonStore(pinia)
    const { user } = storeToRefs(store)

    store.$patch({
      user: {
        lastName: 'Levage',
        firstName: 'Jean',
      },
    })
    expect(user.value).toBeDefined()
  })

  it('has getters for isAuthenticated and isCollab', () => {
    const store = commonStore(pinia)
    const { isAuthenticated, isCollab } = storeToRefs(store)

    vi.spyOn(tokenService, 'getToken').mockReturnValueOnce('aCustomToken')
    vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValueOnce(true)
    store.$patch({
      user: {
        isCollab: true,
      },
    })

    expect(isCollab.value).toBeTruthy()
    expect(isAuthenticated.value).toBeTruthy()
  })

  it('has getters for favoriteEntities and defaultEntity', () => {
    const store = commonStore(pinia)
    const { favoriteEntities, defaultEntity } = storeToRefs(store)

    store.$patch({
      user: {
        entities: {
          favorites: mockedEntities,
          default: mockedEntities[0],
        },
      },
    })

    expect(favoriteEntities.value).toStrictEqual(mockedEntities)
    expect(defaultEntity.value).toStrictEqual(mockedEntities[0])

    store.$patch({
      user: null,
    })

    expect(favoriteEntities.value).toStrictEqual([])
    expect(defaultEntity.value).toBeUndefined()
  })

  it.each(IS_COLLAB)(
    'should call logout function',
    async (isCollabCondition) => {
      const setTokenSpy = vi.spyOn(tokenService, 'setToken')
      const store = commonStore(pinia)

      const spyLogout = vi.spyOn(store, 'logout')
      store.$patch({
        user: {
          isCollab: isCollabCondition,
        },
      })
      await store.logout(store.$state)

      expect(spyLogout).toHaveBeenCalledTimes(1)
      expect(setTokenSpy).toHaveBeenNthCalledWith(1, '')
    },
  )
  it('should obtain user permissions, ensuring that the getter returns the accurate permissions', async () => {
    const store = commonStore(pinia)
    const { userPermissions } = storeToRefs(store)
    const spyFetchUserPermissions = vi.spyOn(store, 'fetchUserPermissions')

    await store.fetchUserPermissions()

    expect(spyFetchUserPermissions).toHaveBeenCalledTimes(1)
    expect(userPermissions.value).toStrictEqual(mockedPermissions)
  })
  it('should log a logger.error message when the request fails', async () => {
    const store = commonStore(pinia)
    const expectedErrorMessage = 'Authorization Error: API Access Denied'

    mockGetPermissions.mockRejectedValueOnce(expectedErrorMessage)
    await store.fetchUserPermissions()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      'Unable to retrieve user permissions: ',
      expectedErrorMessage,
    )
  })
  it('should the selected account permissions be undefined if the user does not select an account', async () => {
    const store = commonStore(pinia)
    const { defaultEntity } = storeToRefs(store)
    const spyFetchUserAccountPermissions = vi.spyOn(
      store,
      'fetchUserAccountPermissions',
    )

    await store.fetchUserAccountPermissions()

    expect(defaultEntity.value?.permissions).toBeUndefined()
    expect(spyFetchUserAccountPermissions).toHaveBeenCalledTimes(1)
  })
  it('should ensure that user account permissions are obtained correctly', async () => {
    const store = commonStore(pinia)
    store.$patch({
      user: {
        entities: {
          default: {
            accountId: 2,
            accountNumber: '2024643902',
            legalName: 'Test 2',
          },
        },
      },
    })
    const { defaultEntity } = storeToRefs(store)
    const spyFetchUserAccountPermissions = vi.spyOn(
      store,
      'fetchUserAccountPermissions',
    )

    await store.fetchUserAccountPermissions()

    expect(spyFetchUserAccountPermissions).toHaveBeenCalledTimes(1)
    expect(defaultEntity.value?.permissions).toStrictEqual(
      mockedPermissions,
    )
  })
  it('should log a logger.error message when the request fails to retrieve account permissions', async () => {
    const store = commonStore(pinia)
    const expectedErrorMessage = 'Authorization Error: API Access Denied'

    mockGetPermissions.mockRejectedValueOnce(expectedErrorMessage)
    await store.fetchUserAccountPermissions()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(
      1,
      'Unable to retrieve permissions for this account: ',
      expectedErrorMessage,
    )
  })
})
