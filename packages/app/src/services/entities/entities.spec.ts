import { describe, it, vi, expect, beforeEach } from 'vitest'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { API_PREFIXES } from '../config'
import type { Entity } from '@pulse/common/types'
import { getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

import { fetchFavoriteEntities, fetchEntities } from '.'

const userStore = getStoreMock(useUserStore)

let throwError = false
const testEntities: Entity[] = getMockedFavoriteEntities()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

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
    const mappedFavoriteEntites = [
      {
        accountId: 1,
        accountNumber: '3669209950',
        color: 'orange',
        legalName: 'Restaurant Le Grand Bleu',
      },
      {
        accountId: 2,
        accountNumber: '4811247468',
        color: 'cyan',
        legalName: 'Restaurant Bistro Kitchen',
      },
      {
        accountId: 3,
        accountNumber: '3590284870',
        color: 'amethyste',
        legalName: 'Fleuriste de la mairie',
      },
      {
        accountId: 4,
        accountNumber: '4377393628',
        color: 'teal',
        legalName: 'La Maison Blanche',
      },
      {
        accountId: 5,
        accountNumber: '4193754384',
        color: 'green',
        legalName: 'La Terrasse Rouge',
      },
      {
        accountId: 6,
        accountNumber: '4644722294',
        color: 'fuschia',
        legalName: 'Restaurant Maison de Pierre',
      },
    ]

    expect(userStore.setFavoriteEntities).toHaveBeenCalledOnce()
    expect(userStore.setFavoriteEntities).toHaveBeenNthCalledWith(1, mappedFavoriteEntites)
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
