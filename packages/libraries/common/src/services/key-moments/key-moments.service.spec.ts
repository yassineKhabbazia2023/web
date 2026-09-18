import { apiGatewayGetMock } from '../../__mocks__/vitest'
import { PublishedKeyMomentsService } from './key-moments.service'

const EXPECTED_URL = 'keymoments/api/accounts/602/key-moments'

describe('PublishedKeyMomentsService', () => {
  describe('hasPublishedKeyMoments', () => {
    it('should call the published exercices route of the account', async () => {
      apiGatewayGetMock.mockResolvedValue({ data: [] })

      await PublishedKeyMomentsService.hasPublishedKeyMoments(602)

      expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(EXPECTED_URL)
    })

    it('should return true when the account has at least one published exercice', async () => {
      apiGatewayGetMock.mockResolvedValue({ data: [{ exerciceId: 2024 }] })

      await expect(PublishedKeyMomentsService.hasPublishedKeyMoments(602)).resolves.toBe(true)
    })

    it('should return false when the account has no published exercice', async () => {
      apiGatewayGetMock.mockResolvedValue({ data: [] })

      await expect(PublishedKeyMomentsService.hasPublishedKeyMoments(602)).resolves.toBe(false)
    })

    it('should return false when the route answers without a body', async () => {
      apiGatewayGetMock.mockResolvedValue({ data: null })

      await expect(PublishedKeyMomentsService.hasPublishedKeyMoments(602)).resolves.toBe(false)
    })
  })
})
