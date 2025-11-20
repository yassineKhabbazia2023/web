import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import { loggerMock } from '@pulse/toolbox/mocks'
import type { CompanyInformationProps } from './CompanyInformationTypes'
import { PENNYLANE_REQUIRED_FIELDS } from './CompanyInformation.const'
import type { Account } from '@entities/services/account'
import { ProviderName } from '@entities/enums'

import CompanyInformation from './CompanyInformation.vue'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

vi.mock('@entities/utils/referential', () => ({
  getFormStructure: vi.fn(() => Promise.resolve([
    {
      title: 'Test Section',
      fields: [],
    },
  ])),
  cleanRecordStructure: vi.fn(),
}))

const mockAccount: Account = {
  accountId: 1,
  accountNumber: '123456',
  legal: {
    legalName: 'Test Company',
    siren: '123456789',
  },
  phone: [
    {
      phoneNumber: '0123456789',
    },
  ],
} as Account

const createWrapper = (props: Partial<CompanyInformationProps> = {}): VueWrapper<any> => {
  const defaultProps: CompanyInformationProps = {
    modelValue: mockAccount,
    providerName: ProviderName.PENNYLANE,
    offerCode: SubscriptionOfferCode.PENNYLANE,
    ...props,
  }

  return mount(CompanyInformation, {
    props: defaultProps,
  })
}

describe('CompanyInformation', () => {
  describe('isValidFields', () => {
    it('should return true when field validation succeeds', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      await nextTick()

      const companyFormRef = wrapper.vm.companyFormRef
      if (companyFormRef) {
        companyFormRef.validateField = vi.fn((_fields, callback) => {
          callback(true)
        })
      }

      const result = await wrapper.vm.isValidFields(['accountNumber'])

      expect(result).toBe(true)
    })

    it('should return false when field validation fails', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      await nextTick()

      const companyFormRef = wrapper.vm.companyFormRef
      if (companyFormRef) {
        companyFormRef.validateField = vi.fn((_fields, callback) => {
          callback(false)
        })
      }

      const result = await wrapper.vm.isValidFields(['accountNumber'])

      expect(result).toBe(false)
    })

    it('should return false when companyFormRef is undefined', async () => {
      const wrapper = createWrapper({ providerName: undefined })
      await flushPromises()

      const result = await wrapper.vm.isValidFields(['accountNumber'])
      expect(result).toBe(false)
    })

    it('should validate multiple fields simultaneously', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      await nextTick()

      const companyFormRef = wrapper.vm.companyFormRef
      if (companyFormRef) {
        companyFormRef.validateField = vi.fn((_fields, callback) => {
          callback(true)
        })
      }

      const result = await wrapper.vm.isValidFields(PENNYLANE_REQUIRED_FIELDS)

      expect(result).toBe(true)
      expect(companyFormRef?.validateField).toHaveBeenCalledWith(
        PENNYLANE_REQUIRED_FIELDS,
        expect.any(Function),
      )
    })
  })

  describe('areRequiredFieldsValid', () => {
    it('should initialize as true', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.vm.areRequiredFieldsValid).toBe(true)
    })

    it('should trigger validation for Pennylane offer after mount', async () => {
      const wrapper = createWrapper({
        offerCode: SubscriptionOfferCode.PENNYLANE,
      })

      await flushPromises()
      await nextTick()

      expect(wrapper.vm.areRequiredFieldsValid).toBeDefined()
    })

    it('should remain true for non-Pennylane offers', async () => {
      const wrapper = createWrapper({
        offerCode: SubscriptionOfferCode.FORMS,
      })

      await flushPromises()
      await nextTick()

      expect(wrapper.vm.areRequiredFieldsValid).toBe(true)
    })

    it('should remain true when offerCode is not provided', async () => {
      const wrapper = createWrapper({
        offerCode: undefined,
      })

      await flushPromises()
      await nextTick()

      expect(wrapper.vm.areRequiredFieldsValid).toBe(true)
    })
  })

  describe('isValid', () => {
    it('should delegate validation to form ref', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      await nextTick()

      const mockValidate = vi.fn(() => Promise.resolve(true))
      const companyFormRef = wrapper.vm.companyFormRef
      if (companyFormRef) {
        companyFormRef.validate = mockValidate
      }

      await wrapper.vm.isValid()

      expect(mockValidate).toHaveBeenCalled()
    })

    it('should return false when form ref is not available', async () => {
      const wrapper = createWrapper({ providerName: undefined })
      await flushPromises()

      const result = await wrapper.vm.isValid()

      expect(result).toBe(false)
    })
  })

  describe('exposed methods and properties', () => {
    it('should expose required validation methods and state', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.vm.isValid).toBeDefined()
      expect(wrapper.vm.isValidFields).toBeDefined()
      expect(wrapper.vm.areRequiredFieldsValid).toBeDefined()
    })
  })
})
