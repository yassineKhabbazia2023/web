import type { FormInstance } from 'element-plus'
import type { DigitalSafeCustomer, InvoicesFullFormModel } from '../types'

export const getDigitalSafeCustomerMock = (
  overrides: Partial<DigitalSafeCustomer> = {},
): DigitalSafeCustomer => ({
  contactId: 1,
  contactGlobalUniqueId: 'contact-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  landPhone: '',
  mobilePhone: '',
  type: 'Customer',
  status: 'Connected',
  personaName: 'Client',
  creationDate: '2025-01-01T00:00:00',
  isActive: true,
  actionLevel: 0,
  labels: [],
  ...overrides,
})

export const getFormRefMock = (validateResult: boolean): FormInstance => ({
  validate: vi.fn().mockImplementation(() => {
    if (validateResult) {
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Validation failed'))
  }),
} as unknown as FormInstance)

export const getInvoicesFullFormModelMock = (
  overrides: Partial<InvoicesFullFormModel> = {},
): InvoicesFullFormModel => ({
  email: 'test@example.com',
  acceptTerms: true,
  selectedContactId: 44448,
  ...overrides,
})
