import { loggerMock } from '@pulse/toolbox/mocks'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/api-gateway.mocks'
import { getMockedEntitySummary } from '../../__mocks__/entity-summary.mock'

import { fetchEntityById } from './entities.service'

vi.mock('../../api', () => ({
  default: () => ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const entityIdMock = 12345
const entitySummaryMock = getMockedEntitySummary({ accountId: entityIdMock })

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
})

