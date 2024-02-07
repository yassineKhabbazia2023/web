import { describe, it, vi, expect, beforeEach } from 'vitest'
import { getMockedFavoriteEntities } from '@/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { getFavoriteEntities, getEntities } from '.'
import type { Entity } from '@kpmg/common'

let throwError = false
const testEntities: Entity[] = getMockedFavoriteEntities()

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      wallet: {
        get: vi.fn((url, _) => {
          if (['favorites', 'display'].includes(url)) {
            return getEntitiesImplementation(throwError)
          }
        })
      }
    }),
    commonStore: () => ({
      $patch: vi.fn()
    })
  }
})

const getEntitiesImplementation = (throwError: boolean) => {
  if (throwError) {
    return Promise.reject(new Error('No data received from the API'))
  }
  return Promise.resolve({
    data: testEntities
  })
}

describe('entities', () => {
  beforeEach(() => {
    throwError = false
  })
  it('should return the favorite entities of the current user', async () => {
    const favoriteEntities = await getFavoriteEntities()

    expect(favoriteEntities).toStrictEqual(testEntities)
  })

  it('should catch an error if favorite entities are not returned from the API', async () => {
    throwError = true
    const favoriteEntities = await getFavoriteEntities()

    expect(favoriteEntities).toStrictEqual([])
  })

  it('should return the entities of the current user', async () => {
    const entities = await getEntities()

    expect(entities).toStrictEqual(testEntities)
  })

  it('should catch an error if entities are not returned from the API', async () => {
    throwError = true
    const entities = await getEntities()

    expect(entities).toStrictEqual([])
  })
})
