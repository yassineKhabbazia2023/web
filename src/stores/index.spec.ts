import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import type { Entity } from './types'
import commonStore from './index'

const now = new Date()
const TEST_ENTITIES: Entity[] = [
  {
    idAccount: '7c2b430b-7190-4cd1',
    name: 'Test 1',
    color: 'orange',
    ibs: 'IBS93781560ZE19'
  },
  {
    idAccount: '3b2b430b-4563-4cd4',
    name: 'Test 2',
    color: 'cyan',
    ibs: 'IBS43784540ZE33'
  }
]

vi.mock('jwt-decode', () => ({
  default: () => ({
    exp: now.setHours(now.getHours() + 1)
  })
}))

const pinia = createTestingPinia({
  initialState: {
    user: null
  },
  stubActions: false
})

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
        firstName: 'Jean'
      }
    })
    expect(user.value).toBeDefined()
  })

  it('has getters for isAuthenticated and isCollab', () => {
    const store = commonStore(pinia)
    const { isAuthenticated, isCollab } = storeToRefs(store)

    store.$patch({
      user: {
        token: 'aCustomToken',
        isCollab: true
      }
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
          favorites: TEST_ENTITIES,
          default: TEST_ENTITIES[0]
        }
      }
    })

    expect(favoriteEntities.value).toStrictEqual(TEST_ENTITIES)
    expect(defaultEntity.value).toStrictEqual(TEST_ENTITIES[0])

    store.$patch({
      user: null
    })

    expect(favoriteEntities.value).toStrictEqual([])
    expect(defaultEntity.value).toBeUndefined()
  })

  it.each(IS_COLLAB)(
    'should call logout function',
    async (isCollabCondition) => {
      const store = commonStore(pinia)

      const spyLogout = vi.spyOn(store, 'logout')
      store.$patch({
        user: {
          isCollab: isCollabCondition
        }
      })
      await store.logout(store.$state)

      expect(spyLogout).toHaveBeenCalledTimes(1)
    }
  )
})
