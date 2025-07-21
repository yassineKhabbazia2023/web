import { loggerMock } from '@pulse/core/mocks'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/api-gateway.mocks'
import { getMockedEntity } from '../../__mocks__/entities.mocks'

import { fetchEntityById } from './entities.service'

vi.mock('../../api', () => ({
  default: () => ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const entityIdMock = 12345
const entityMock = getMockedEntity({ accountId: entityIdMock })

describe('entities.service', () => {
  describe('fetchEntityById', () => {
    it('should return entity data when API call succeeds', async () => {
      const expectedUrl = `account/api/accounts/${entityIdMock}/summary`

      apiGatewayGetMock.mockResolvedValueOnce({
        data: entityMock,
      })

      const result = await fetchEntityById(entityIdMock)

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
      expect(result).toStrictEqual(entityMock)
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

