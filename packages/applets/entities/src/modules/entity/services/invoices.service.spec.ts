import { API_PREFIXES } from '@pulse/common/constants'
import type { BillingSubmissionInputRequest } from '@entities/modules/entity/types'
import { getDigitalSafeCustomerMock } from '@entities/__mocks__/invoices.mocks'
import { InvoicesService } from './invoices.service'

const commonApiGetMock = vi.hoisted(() => vi.fn())
const commonApiPostMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: commonApiGetMock,
      post: commonApiPostMock,
    },
  }),
}))

describe('InvoicesService', () => {
  describe('getAvailableCustomersForDigitalSafe', () => {
    it('should return customers from the API response', async () => {
      const entityId = 123
      const customers = [getDigitalSafeCustomerMock(), getDigitalSafeCustomerMock({ contactId: 2 })]
      commonApiGetMock.mockResolvedValueOnce({ data: { items: customers } })

      const result = await InvoicesService.getAvailableCustomersForDigitalSafe(entityId)

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.INVOICES}/accounts/${entityId}/customers`,
      )
      expect(result).toEqual(customers)
    })

    it('should return empty array when no customers', async () => {
      const entityId = 456
      commonApiGetMock.mockResolvedValueOnce({ data: { items: [] } })

      const result = await InvoicesService.getAvailableCustomersForDigitalSafe(entityId)

      expect(result).toEqual([])
    })
  })

  describe('submitIntegration', () => {
    it('should call the API with correct URL and payload', async () => {
      const accountNumber = 'ACC-123'
      const payload: BillingSubmissionInputRequest = {
        dematerializationEmail: 'billing@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        vaultEmail: 'vault@example.com',
        requesterEmail: 'requester@example.com',
      }
      commonApiPostMock.mockResolvedValueOnce({})

      await InvoicesService.submitIntegration(accountNumber, payload)

      expect(commonApiPostMock).toHaveBeenCalledWith(
        `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`,
        payload,
      )
    })

    it('should throw when api call fails', async () => {
      const accountNumber = 'ACC-123'
      const payload: BillingSubmissionInputRequest = {
        dematerializationEmail: 'billing@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        vaultEmail: 'vault@example.com',
        requesterEmail: 'requester@example.com',
      }
      const error = new Error('Boom')
      commonApiPostMock.mockRejectedValueOnce(error)

      await expect(InvoicesService.submitIntegration(accountNumber, payload)).rejects.toThrow('Boom')

      expect(commonApiPostMock).toHaveBeenCalledWith(
        `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`,
        payload,
      )
    })
  })
})
