import { InvoicesSecondStepFormManager } from './invoices-second-step.form.manager'
import { InvoicesService } from '../../services/invoices.service'
import { getDigitalSafeCustomerMock } from '../../__mocks__'

vi.mock('../../services/invoices.service')

describe('InvoicesSecondStepFormManager', () => {
  describe('mapCustomerToOption', () => {
    it('should map customer to dropdown option with firstName, lastName and email', () => {
      const customer = getDigitalSafeCustomerMock({
        contactId: 42,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      })

      const result = InvoicesSecondStepFormManager.mapCustomerToOption(customer)

      expect(result).toEqual({
        pValue: 42,
        pLabel: 'Jane Smith - jane@example.com',
        pDescription: 'jane@example.com',
      })
    })

    it('should handle customer with only firstName', () => {
      const customer = getDigitalSafeCustomerMock({
        firstName: 'Bob',
        lastName: '',
        email: 'bob@example.com',
      })

      const result = InvoicesSecondStepFormManager.mapCustomerToOption(customer)

      expect(result.pLabel).toBe('Bob  - bob@example.com')
    })

    it('should handle customer with only lastName', () => {
      const customer = getDigitalSafeCustomerMock({
        firstName: '',
        lastName: 'Wilson',
        email: 'wilson@example.com',
      })

      const result = InvoicesSecondStepFormManager.mapCustomerToOption(customer)

      expect(result.pLabel).toBe('Wilson - wilson@example.com')
    })

    it('should include email as description', () => {
      const customer = getDigitalSafeCustomerMock({ email: 'test@test.com' })

      const result = InvoicesSecondStepFormManager.mapCustomerToOption(customer)

      expect(result.pDescription).toBe('test@test.com')
    })

    it('should use contactId as pValue', () => {
      const customer = getDigitalSafeCustomerMock({ contactId: 789 })

      const result = InvoicesSecondStepFormManager.mapCustomerToOption(customer)

      expect(result.pValue).toBe(789)
    })
  })

  describe('fetchCustomerOptions', () => {
    it('should return success true with mapped options when API call succeeds', async () => {
      const customers = [
        getDigitalSafeCustomerMock({
          contactGlobalUniqueId: 'id-1',
          firstName: 'User',
          lastName: 'One',
          email: 'user.one@example.com',
        }),
        getDigitalSafeCustomerMock({
          contactGlobalUniqueId: 'id-2',
          firstName: 'User',
          lastName: 'Two',
          email: 'user.two@example.com',
        }),
      ]
      vi.mocked(InvoicesService.getAvailableCustomersForDigitalSafe).mockResolvedValueOnce(customers)

      const result = await InvoicesSecondStepFormManager.fetchCustomerOptions(100)

      expect(result.success).toBe(true)
      expect(result.options).toHaveLength(2)
      expect(result.options[0].pLabel).toBe('User One - user.one@example.com')
      expect(result.options[1].pLabel).toBe('User Two - user.two@example.com')
    })

    it('should call getAvailableCustomersForDigitalSafe with correct entityId', async () => {
      vi.mocked(InvoicesService.getAvailableCustomersForDigitalSafe).mockResolvedValueOnce([])

      await InvoicesSecondStepFormManager.fetchCustomerOptions(456)

      expect(vi.mocked(InvoicesService.getAvailableCustomersForDigitalSafe)).toHaveBeenCalledWith(456)
    })

    it('should return success false with empty options when API call fails', async () => {
      vi.mocked(InvoicesService.getAvailableCustomersForDigitalSafe).mockRejectedValueOnce(new Error('API Error'))

      const result = await InvoicesSecondStepFormManager.fetchCustomerOptions(100)

      expect(result.success).toBe(false)
      expect(result.options).toEqual([])
    })

    it('should return empty options when API returns empty array', async () => {
      vi.mocked(InvoicesService.getAvailableCustomersForDigitalSafe).mockResolvedValueOnce([])

      const result = await InvoicesSecondStepFormManager.fetchCustomerOptions(100)

      expect(result.success).toBe(true)
      expect(result.options).toEqual([])
    })
  })
})
