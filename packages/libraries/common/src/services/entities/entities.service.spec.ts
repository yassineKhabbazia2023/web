import type { Entity } from '@pulse/common/types'
import { apiGatewayGetMock } from '../../__mocks__/vitest'
import { getMockedEntitySummary, getMockedFavoriteEntities } from '../../__mocks__'

import { DEFAULT_ENTITIES, fetchEntities, fetchEntityById } from './entities.service'
import { API_PREFIXES } from '@common/constants'

const entityIdMock = 12345
const entitySummaryMock = getMockedEntitySummary({ accountId: entityIdMock })
const testEntities: Entity[] = getMockedFavoriteEntities()

describe('entities.service', () => {
  describe('fetchEntityById', () => {
    it('should return entity data when API call succeeds', async () => {
      const expectedUrl = `${API_PREFIXES.CONNECT}/accounts/${entityIdMock}/summary`

      apiGatewayGetMock.mockResolvedValue({
        data: entitySummaryMock,
      })

      const result = await fetchEntityById(entityIdMock)

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
      expect(result).toStrictEqual(entitySummaryMock)
    })

    it('should handle API error and rethrow it', async () => {
      const errorMock = 'Entity not found'
      const error = new Error(errorMock)

      apiGatewayGetMock.mockRejectedValue(error)

      await expect(fetchEntityById(entityIdMock)).rejects.toThrow(errorMock)
      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
    })
  })

  describe('user entities', () => {
    it('should return the entities of the current user', async () => {
      apiGatewayGetMock.mockResolvedValue({
        data: testEntities,
      })
      const entities = await fetchEntities()

      expect(entities).toStrictEqual(testEntities)
    })

    it('should return default value if API call is in error', async () => {
      apiGatewayGetMock.mockRejectedValue(new Error('No data received from the API'))
      const entities = await fetchEntities()

      expect(entities).toStrictEqual(DEFAULT_ENTITIES)
    })
  })
})

