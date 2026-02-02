import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import type { BillingSubmissionInputRequest } from '@entities/modules/entity/types'
import { InvoicesService } from './invoices.service'

const commonApiPostMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: commonApiPostMock,
    },
  }),
}))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('InvoicesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitIntegration', () => {
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
})
