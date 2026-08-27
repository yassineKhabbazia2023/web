import { apiGatewayMock } from '../../__mocks__/vitest'
import { API_PREFIXES } from '../../constants/api-prefixes'
import { DematMailRoutingCode } from './invoices.enums'
import { InvoicesService } from './invoices.service'

const ACCOUNT_ID = 26

describe('InvoicesService', () => {
  describe('fetchDematAccount', () => {
    it('should map the fields the solicitation relies on', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({
        data: {
          accountId: ACCOUNT_ID,
          accountNumber: '2024664516',
          email: 'facture@example.com',
          accountRoutingCode: DematMailRoutingCode.B2C,
          accountRoutingLabel: 'B2C',
          modalClosedAt: '2026-08-20T10:00:00.000Z',
        },
      })

      const result = await InvoicesService.fetchDematAccount(ACCOUNT_ID)

      expect(result).toStrictEqual({
        accountId: ACCOUNT_ID,
        dematMail: 'facture@example.com',
        routingCode: DematMailRoutingCode.B2C,
        modalClosedAt: '2026-08-20T10:00:00.000Z',
      })
      expect(apiGatewayMock.get)
        .toHaveBeenCalledExactlyOnceWith(`${API_PREFIXES.DEMAT}/accounts/${ACCOUNT_ID}/currentuser`)
    })

    it('should fall back to null when the mail, the routing code and the closure date are absent', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({ data: { accountId: ACCOUNT_ID } })

      const result = await InvoicesService.fetchDematAccount(ACCOUNT_ID)

      expect(result).toStrictEqual({
        accountId: ACCOUNT_ID,
        dematMail: null,
        routingCode: null,
        modalClosedAt: null,
      })
    })

    it('should rethrow errors', async () => {
      const error = new Error('Server Error')
      apiGatewayMock.get.mockRejectedValueOnce(error)

      await expect(InvoicesService.fetchDematAccount(ACCOUNT_ID)).rejects.toThrow(error)
    })
  })

  describe('submitDematMail', () => {
    it('should post the submission payload', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: undefined })
      const payload = {
        dematerializationEmail: 'facture@example.com',
        requesterEmail: 'contact@example.com',
      }

      await InvoicesService.submitDematMail(ACCOUNT_ID, payload)

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.DEMAT}/accounts/${ACCOUNT_ID}/hubspot/submissions/currentuser`,
        payload,
      )
    })

    it('should rethrow errors', async () => {
      const error = new Error('Server Error')
      apiGatewayMock.post.mockRejectedValueOnce(error)

      await expect(InvoicesService.submitDematMail(ACCOUNT_ID, {
        dematerializationEmail: 'facture@example.com',
        requesterEmail: 'contact@example.com',
      })).rejects.toThrow(error)
    })
  })

  describe('closeDematModal', () => {
    it('should post the closure', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: undefined })

      await InvoicesService.closeDematModal(ACCOUNT_ID)

      expect(apiGatewayMock.post)
        .toHaveBeenCalledExactlyOnceWith(`${API_PREFIXES.DEMAT}/accounts/${ACCOUNT_ID}/demat-ready/closure`)
    })

    it('should rethrow errors', async () => {
      const error = new Error('Server Error')
      apiGatewayMock.post.mockRejectedValueOnce(error)

      await expect(InvoicesService.closeDematModal(ACCOUNT_ID)).rejects.toThrow(error)
    })
  })
})
