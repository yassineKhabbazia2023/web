import type { FormInstance, FormItemRule } from '@pulse/styleguide/types'
import { ref } from 'vue'
import { useAddCustomerStepInformationValidation } from './add-customer-step-information.validation'

describe('useAddCustomerStepInformationValidation', () => {
  const requiredFieldMessage = 'required'
  const invalidPhoneNumberMessage = 'invalid phone'
  const customerTitleOptions = [
    { pValue: 'M', pLabel: 'Monsieur' },
    { pValue: 'Mme', pLabel: 'Madame' },
  ]

  function createValidation(formRef = ref<FormInstance | null>(null)) {
    return useAddCustomerStepInformationValidation({
      formRef,
      customerTitleOptions,
      requiredFieldMessage,
      invalidPhoneNumberMessage,
    })
  }

  it('should require a title', async () => {
    const { rules } = createValidation()
    const titleRules = rules.title as FormItemRule[]
    const validator = titleRules[0].validator
    const callback = vi.fn()

    await validator?.({}, '', callback, {}, {})

    expect(callback).toHaveBeenCalledWith(new Error(requiredFieldMessage))
  })

  it('should reject a title that is not provided by the referential', async () => {
    const { rules } = createValidation()
    const titleRules = rules.title as FormItemRule[]
    const validator = titleRules[1].validator
    const callback = vi.fn()

    await validator?.({}, 'Dr', callback, {}, {})

    expect(callback).toHaveBeenCalledWith(new Error(requiredFieldMessage))
  })

  it('should accept a title provided by the referential', async () => {
    const { rules } = createValidation()
    const titleRules = rules.title as FormItemRule[]
    const validator = titleRules[1].validator
    const callback = vi.fn()

    await validator?.({}, 'M', callback, {}, {})

    expect(callback).toHaveBeenCalledWith()
  })

  it('should reject an invalid mobile phone number', async () => {
    const { rules } = createValidation()
    const mobilePhoneRules = rules.mobilePhone as FormItemRule[]
    const validator = mobilePhoneRules[1].validator
    const callback = vi.fn()

    await validator?.({}, '+331', callback, {}, {})

    expect(callback).toHaveBeenCalledWith(new Error(invalidPhoneNumberMessage))
  })

  it('should require a mobile phone number', async () => {
    const { rules } = createValidation()
    const mobilePhoneRules = rules.mobilePhone as FormItemRule[]
    const validator = mobilePhoneRules[0].validator
    const callback = vi.fn()

    await validator?.({}, '', callback, {}, {})

    expect(callback).toHaveBeenCalledWith(new Error(requiredFieldMessage))
  })

  it('should validate a valid form', async () => {
    const validateForm = vi.fn().mockResolvedValue(true)
    const formRef = ref({ validate: validateForm } as unknown as FormInstance)
    const { validate } = createValidation(formRef)

    await expect(validate()).resolves.toBe(true)
    expect(validateForm).toHaveBeenCalledExactlyOnceWith()
  })

  it('should reject an invalid form', async () => {
    const formRef = ref({
      validate: vi.fn().mockRejectedValue(new Error('invalid')),
    } as unknown as FormInstance)
    const { validate } = createValidation(formRef)

    await expect(validate()).resolves.toBe(false)
  })
})
