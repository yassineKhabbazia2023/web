import { describe, it, vi, expect, beforeEach } from 'vitest'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { fetchFavoriteEntities, fetchEntities } from '.'
import { API_PREFIXES } from '../config'
import type { Entity } from '@pulse/common/types'

let throwError = false
const testEntities: Entity[] = getMockedFavoriteEntities()

const spyPNotification = vi.hoisted(() => vi.fn())
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

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn().mockImplementation((url) => {
          if (url === `${API_PREFIXES.ACCOUNT}/accounts/currentuser`) {
            return fetchEntitiesImplementation(throwError)
          }
          if (url === `${API_PREFIXES.WALLET}/favorites/currentuser`) {
            return fetchEntitiesImplementation(throwError)
          }
        }),
      },
    }),
    commonStore: () => ({
      $patch: vi.fn(),
    }),
    dataProvider: () => {
      return {
        fetchUserData: vi.fn(),
      }
    },
  }
})

const fetchEntitiesImplementation = (throwError: boolean) => {
  if (throwError) {
    return Promise.reject(new Error('No data received from the API'))
  }
  return Promise.resolve({
    data: testEntities,
  })
}

describe('entities', () => {
  beforeEach(() => {
    throwError = false
  })
  it('should return the favorite entities of the current user', async () => {
    const favoriteEntities = await fetchFavoriteEntities()

    expect(favoriteEntities).toStrictEqual(testEntities)
  })

  it('should catch an error if favorite entities are not returned from the API', async () => {
    throwError = true
    const favoriteEntities = await fetchFavoriteEntities()

    expect(favoriteEntities).toStrictEqual([])
  })

  it('should return the entities of the current user', async () => {
    const entities = await fetchEntities()

    expect(entities).toStrictEqual(testEntities)
  })

  it('should catch an error if entities are not returned from the API', async () => {
    throwError = true
    const entities = await fetchEntities()

    expect(entities).toStrictEqual([])
  })
})
