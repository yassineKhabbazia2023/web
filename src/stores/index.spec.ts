import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { getMockedEntities, getMockedUserPermissions } from '../mocks'
import commonStore from './index'
import { tokenService } from '../main'

const mockedEntities = getMockedEntities()
const mockedUserPermissions = getMockedUserPermissions()

const pinia = createTestingPinia({
  initialState: {
    user: null,
  },
  stubActions: false,
})

const mockGetUserPermissions = vi.fn((_url) => {
  return Promise.resolve({
    data: mockedUserPermissions,
  })
})

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      get: mockGetUserPermissions,
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
    expect(userPermissions.value).toStrictEqual(mockedUserPermissions)
  })
  it('should log a console.error message when the request fails', async () => {
    const store = commonStore(pinia)
    const expectedErrorMessage = 'Authorization Error: API Access Denied'
    const spyConsole = vi.spyOn(console, 'error')

    mockGetUserPermissions.mockRejectedValueOnce(expectedErrorMessage)
    await store.fetchUserPermissions()

    expect(spyConsole).toHaveBeenCalledOnce()
    expect(spyConsole).toHaveBeenNthCalledWith(
      1,
      'Unable to fetch user permissions: ',
      expectedErrorMessage,
    )
  })
})
