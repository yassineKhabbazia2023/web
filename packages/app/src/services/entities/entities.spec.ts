import { loggerMock } from '@pulse/core/mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import type { Entity } from '@pulse/common/types'

import { fetchFavoriteEntities, fetchEntities, DEFAULT_ENTITIES, DEFAULT_FAVORITE_ENTITIES } from '.'

const testEntities: Entity[] = getMockedFavoriteEntities()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const gatewayGetMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: gatewayGetMock,
      },
    }),
  }
})

describe('user favorite entities', () => {
  it('should return the favorite entities of the current user', async () => {
    gatewayGetMock.mockResolvedValue({
      data: testEntities,
    })
    const favoriteEntities = await fetchFavoriteEntities()
    expect(favoriteEntities).toStrictEqual(testEntities)
  })

  it('should return default value if API call is in error', async () => {
    gatewayGetMock.mockRejectedValue(new Error('No data received from the API'))
    const favoriteEntities = await fetchFavoriteEntities()

    expect(favoriteEntities).toStrictEqual(DEFAULT_FAVORITE_ENTITIES)
  })
})

describe('user entities', () => {
  it('should return the entities of the current user', async () => {
    gatewayGetMock.mockResolvedValue({
      data: testEntities,
    })
    const entities = await fetchEntities()

    expect(entities).toStrictEqual(testEntities)
  })

  it('should return default value if API call is in error', async () => {
    gatewayGetMock.mockRejectedValue(new Error('No data received from the API'))
    const entities = await fetchEntities()

    expect(entities).toStrictEqual(DEFAULT_ENTITIES)
  })
})
