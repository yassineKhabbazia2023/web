import { apiGatewayMock } from '../../__mocks__/vitest'
import { API_PREFIXES } from '../../constants/api-prefixes'

import { InvoicesSereniteService } from './invoices-serenite.service'

const SERENITY_MODAL_URL = `${API_PREFIXES.CONNECT}/serenity-modal`

describe('InvoicesSereniteService', () => {
  describe('fetchShouldDisplayModal', () => {
    it('should return the shouldDisplay flag from the gateway', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({ data: { shouldDisplay: true } })

      const result = await InvoicesSereniteService.fetchShouldDisplayModal()

      expect(result).toBe(true)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(SERENITY_MODAL_URL)
    })

    it('should propagate gateway errors', async () => {
      apiGatewayMock.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(InvoicesSereniteService.fetchShouldDisplayModal()).rejects.toThrow('Network error')
    })
  })

  describe('markModalAsSeen', () => {
    it('should post isAccepted=true for a "yes" result', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: undefined })

      await InvoicesSereniteService.markModalAsSeen('yes')

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(SERENITY_MODAL_URL, { isAccepted: true })
    })

    it('should post isAccepted=false for a "no" result', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: undefined })

      await InvoicesSereniteService.markModalAsSeen('no')

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(SERENITY_MODAL_URL, { isAccepted: false })
    })

    it('should propagate gateway errors', async () => {
      apiGatewayMock.post.mockRejectedValueOnce(new Error('Network error'))

      await expect(InvoicesSereniteService.markModalAsSeen('no')).rejects.toThrow('Network error')
    })
  })
})
