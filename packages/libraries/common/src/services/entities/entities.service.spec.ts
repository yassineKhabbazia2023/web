import { loggerMock } from '@pulse/toolbox/mocks'
import type { Entity } from '@pulse/common/types'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/vitest'
import { getMockedEntitySummary, getMockedFavoriteEntities } from '../../__mocks__'

import { DEFAULT_ENTITIES, fetchEntities, fetchEntityById } from './entities.service'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('../../api/interceptors/request-token.interceptor', () => ({
  requestTokenInterceptor: vi.fn((config) => config),
}))

const entityIdMock = 12345
const entitySummaryMock = getMockedEntitySummary({ accountId: entityIdMock })
const testEntities: Entity[] = getMockedFavoriteEntities()

describe('entities.service', () => {
  describe('fetchEntityById', () => {
    it('should return entity data when API call succeeds', async () => {
      const expectedUrl = `connect/api/accounts/${entityIdMock}/summary`

      apiGatewayGetMock.mockResolvedValueOnce({
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

      apiGatewayGetMock.mockRejectedValueOnce(error)

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

