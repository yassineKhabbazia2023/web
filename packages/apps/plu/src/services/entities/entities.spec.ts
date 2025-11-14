import { loggerMock } from '@pulse/toolbox/mocks'
import { getMockedFavoriteEntities } from '@pulse/common/mocks'
import type { Entity } from '@pulse/common/types'

import { fetchEntities, DEFAULT_ENTITIES } from './entity.service'

const testEntities: Entity[] = getMockedFavoriteEntities()

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

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
