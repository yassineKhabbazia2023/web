import CreateMandateForm from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import {
  waitForAsyncImports,
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { PForm, PFormItem, PInput, PCol, PRow } from '@kpmg/styleguide'

function mockMandateService(
  createMandateData: any,
  validateIbanData: any,
  getBankDetailData: any) {
  return {
    createMandate: vi.fn(() => createMandateData),
    validateIban: vi.fn(() => validateIbanData),
    getBankDetail: vi.fn(() => getBankDetailData)
  }
}

vi.mock('@/services/mandate', () => {
  return mockMandateService(
    {
      data: {
        id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
        name: 'Mike',
        siretNumber: '123456789',
        erpId: '1234567891',
        signatory: {
          title: 'M',
          firstName: 'maroo',
          lastName: 'elleuch',
          email: 'elleuch@email.com'
        },
        address: {
          street: 'RUE DU COMMERCE',
          addressComplement: '',
          zipCode: '59590',
          city: 'RAISMES',
          country: 'FRANCE'
        }
      }
    },
    {
      valid: true
    },
    {
      code: '123451234512344567891210',
      name: 'Banque postale',
      jeDeclare: {
        isPartner: true,
        isScrapable: false
      }
    }
  )
})

const createWrapper = (props: any = {}) =>
  wrapperFactory(CreateMandateForm, { props })

describe('form.vue', () => {
  it('renders the component when step value is 1', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(10)
    expect(wrapper.exists()).toBeTruthy()
  })

  const step1TestCases = [
    {
      initial: {
        erpId: '1234567891',
        name: 'Mike',
        siretNumber: '123456789'
      }
    }
  ]

  it.each(step1TestCases)('renders the component when step value is 1', async (step1TestCase) => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(300)
    await dynamicUntilFoundComponent(wrapper, PForm)
    await dynamicUntilFoundComponent(wrapper, PFormItem)
    await dynamicUntilFoundComponent(wrapper, PInput)
    await dynamicUntilFoundComponent(wrapper, PCol)
    await dynamicUntilFoundComponent(wrapper, PRow)

    const ibsInputElement = wrapper
      .find('[data-testid="ibs-number-test"]')
    await ibsInputElement
      .setValue(step1TestCase.initial.erpId)
    await ibsInputElement.trigger('change')

    const companyNameInputElement = wrapper
      .find('[data-testid="name-input-test"]')
    expect((companyNameInputElement.element as
      HTMLInputElement).value).toBe(step1TestCase.initial.name)

    const siretNumberInputElement: any = wrapper
      .find('[data-testid="siretNumber-input-test"]')
    expect((siretNumberInputElement.element as
       HTMLInputElement).value).toBe(step1TestCase.initial.siretNumber)
  })

  it('emits the loading event form', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(50)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect((input.element as HTMLInputElement).value).toBe('1234567891')
    const emittedEnableDisableEvent: any = wrapper.emitted('enable-disable-next')
    expect(emittedEnableDisableEvent).toBeTruthy()
    // expect(createMandate).toHaveBeenCalled()
  })

  it('renders the component when step value is 2', async () => {
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(60)
    vi.spyOn(wrapper.vm, 'validateIBS').mockImplementation(() => true)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('1234567891')
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(50)
    vi.spyOn(wrapper.vm, 'validateIBS').mockImplementation(() => true)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('123456789')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('123456789')
  })

  it('checkAndEmitEvents when fields are not filled', async () => {
    const wrapper = createWrapper({ step: 2 })
    await waitForAsyncImports(150)
    const input = wrapper.find('input[data-testid="firstName-test"]')
    await input.setValue('')
    await input.trigger('blur')

    wrapper.vm.checkAndEmitEvents()
    expect(wrapper.emitted()['enable-disable-next']).toBeTruthy()
  })

  const testCases = [
    ['email', 'zipcode'],
    ['seif@gmail.com', '75008']
  ]

  it.each(testCases)('when step value is 2 (email: %s, zipCode: %s invalid)',
    async (email, zipCode) => {
      const wrapper = createWrapper({ step: 2 })
      await waitForAsyncImports(150)

      const emailInput = wrapper.find('input[data-testid="email-test"]')
      await emailInput.setValue(email)
      await emailInput.trigger('blur')

      const input = wrapper.find('input[data-testid="zipCode-test"]')
      await input.setValue(zipCode)
      await input.trigger('blur')

      if (email === 'email') {
        expect(wrapper.emitted()['enable-disable-next']).toBeTruthy()
      } else {
        expect(wrapper.emitted()['enable-disable-next']).toBeTruthy()
      }
    })

  const step3TestCases = [
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true
      }
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '5432',
        branchCode: '5432',
        accountNumber: '0198765432',
        key: '2',
        valid: false
      }
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12'
      },
      updated: {
        institutionCode: '5432s',
        branchCode: '5432s',
        accountNumber: '019876543,',
        key: '2s',
        valid: false
      }
    }
  ]

  it.each(step3TestCases)('renders the component when step value is 3 (valid rib)',
    async (step3TestCase) => {
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

      await dynamicUntilFoundComponent(wrapper, PForm)
      await dynamicUntilFoundComponent(wrapper, PFormItem)
      await dynamicUntilFoundComponent(wrapper, PInput)
      await dynamicUntilFoundComponent(wrapper, PCol)
      await dynamicUntilFoundComponent(wrapper, PRow)

      const institutionCodeInputElement = wrapper
        .find('[data-testid="institutionCode-input-test"]')
      await institutionCodeInputElement
        .setValue(step3TestCase.updated.institutionCode)
      await institutionCodeInputElement.trigger('blur')

      const branchCodeInputElement = wrapper
        .find('[data-testid="branchCode-input-test"]')
      await branchCodeInputElement
        .setValue(step3TestCase.updated.branchCode)
      await branchCodeInputElement.trigger('blur')

      const accountNumberInputElement = wrapper
        .find('[data-testid="accountNumber-input-test"]')
      await accountNumberInputElement
        .setValue(step3TestCase.updated.accountNumber)
      await accountNumberInputElement.trigger('blur')

      const keyInputElement = wrapper
        .find('[data-testid="key-input-test"]')
      await keyInputElement
        .setValue(step3TestCase.updated.key)
      await keyInputElement.trigger('blur')

      expect(wrapper.vm.createMandateForm.institutionCode)
        .toStrictEqual(step3TestCase.updated.institutionCode)
      expect(wrapper.vm.createMandateForm.branchCode)
        .toStrictEqual(step3TestCase.updated.branchCode)
      expect(wrapper.vm.createMandateForm.accountNumber)
        .toStrictEqual(step3TestCase.updated.accountNumber)
      expect(wrapper.vm.createMandateForm.key)
        .toStrictEqual(step3TestCase.updated.key)
    })

  it.each(step3TestCases)('renders the component when step value is 3 (unvalid rib)',
    async (step3TestCase) => {
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

      await dynamicUntilFoundComponent(wrapper, PForm)
      await dynamicUntilFoundComponent(wrapper, PFormItem)
      await dynamicUntilFoundComponent(wrapper, PInput)
      await dynamicUntilFoundComponent(wrapper, PCol)
      await dynamicUntilFoundComponent(wrapper, PRow)

      const institutionCodeInputElement = wrapper
        .find('[data-testid="institutionCode-input-test"]')
      await institutionCodeInputElement
        .setValue(step3TestCase.updated.institutionCode)
      await institutionCodeInputElement.trigger('blur')

      const branchCodeInputElement = wrapper
        .find('[data-testid="branchCode-input-test"]')
      await branchCodeInputElement
        .setValue(step3TestCase.updated.branchCode)
      await branchCodeInputElement.trigger('blur')

      const accountNumberInputElement = wrapper
        .find('[data-testid="accountNumber-input-test"]')
      await accountNumberInputElement
        .setValue(step3TestCase.updated.accountNumber)
      await accountNumberInputElement.trigger('blur')

      const keyInputElement = wrapper
        .find('[data-testid="key-input-test"]')
      await keyInputElement
        .setValue(step3TestCase.updated.key)
      await keyInputElement.trigger('blur')

      expect(wrapper.vm.createMandateForm.institutionCode)
        .toStrictEqual(step3TestCase.updated.institutionCode)
      expect(wrapper.vm.createMandateForm.branchCode)
        .toStrictEqual(step3TestCase.updated.branchCode)
      expect(wrapper.vm.createMandateForm.accountNumber)
        .toStrictEqual(step3TestCase.updated.accountNumber)
      expect(wrapper.vm.createMandateForm.key)
        .toStrictEqual(step3TestCase.updated.key)
    })
})
