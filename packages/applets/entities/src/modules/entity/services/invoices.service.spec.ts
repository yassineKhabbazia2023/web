import { API_PREFIXES } from '@pulse/common/constants'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import type { BillingSubmissionInputRequest } from '@entities/modules/entity/types'
import { DigitalSafeStatus } from '@entities/modules/entity/enums'
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

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

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
      expect(loggerErrorSpy).not.toHaveBeenCalled()
    })

    it('should log error when api call fails', async () => {
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

      await InvoicesService.submitIntegration(accountNumber, payload)

      expect(commonApiPostMock).toHaveBeenCalledWith(
        `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`,
        payload,
      )
      expect(loggerErrorSpy).toHaveBeenCalledWith('Unmanaged case', error)
    })
  })

  describe('getSubscriptionStatus', () => {
    it('should return the subscription status from the API', async () => {
      const accountNumber = 'ACC-789'
      commonApiGetMock.mockResolvedValueOnce({ data: DigitalSafeStatus.SUBMITTED })

      const result = await InvoicesService.getSubscriptionStatus(accountNumber)

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`,
      )
      expect(result).toBe(DigitalSafeStatus.SUBMITTED)
    })

    it('should return NOT_SUBSCRIBED status', async () => {
      const accountNumber = 'ACC-456'
      commonApiGetMock.mockResolvedValueOnce({ data: DigitalSafeStatus.NOT_SUBSCRIBED })

      const result = await InvoicesService.getSubscriptionStatus(accountNumber)

      expect(result).toBe(DigitalSafeStatus.NOT_SUBSCRIBED)
    })

    it('should return COMPLETED status', async () => {
      const accountNumber = 'ACC-999'
      commonApiGetMock.mockResolvedValueOnce({ data: DigitalSafeStatus.COMPLETED })

      const result = await InvoicesService.getSubscriptionStatus(accountNumber)

      expect(result).toBe(DigitalSafeStatus.COMPLETED)
    })
  })
})
