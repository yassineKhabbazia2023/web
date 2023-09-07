import { mount } from '@vue/test-utils'
import CreateMandateForm from '.'
import { expect, describe, it, vi } from 'vitest'

vi.mock('@/services/mandate', () => {
  const createMandate = vi.fn(() => ({
    data: {
      id: '140edf1b-0a59-4f70-abbc-052462faa010',
      name: 'MK 2000',
      siretNumber: '50339868700015',
      erpId: '1999072765',
      bankServicesProviderId: '',
      signatory: {
        title: 'M',
        firstName: 'maroo',
        lastName: 'elleuch',
        address: {
          street: 'street',
          complements: 'complement',
          zipCode: 'zipcode',
          city: 'city',
          country: 'contry'
        }
      }
    }
  }))
  return { createMandate }
})

const createWrapper = (props: any = {}) =>
  mount(CreateMandateForm, {
    props
  })

const waitForAsyncOperations = async () => {
  await vi.dynamicImportSettled()
}

describe('form.vue', () => {
  it('renders the component when step value is 1', async () => {
    const wrapper = createWrapper({ step: 1 })
    expect(wrapper.exists()).toBeTruthy()
  })

  const step1TestCases = [
    {
      initial: {
        ibs: '1234567891',
        name: 'Mike',
        siretNumber: '123456789'
      },
      updated: {
        ibs: '1234567894',
        name: 'MK 2000',
        siretNumber: '50339868700015'
      }
    },
    {
      initial: {
        ibs: '1234567891',
        name: 'Mike',
        siretNumber: '123456789'
      },
      updated: {
        ibs: '1234567898',
        name: 'MK 2000',
        siretNumber: '50339868700015'
      }
    }
  ]

  it.each(step1TestCases)('renders the component when step value is 1', async (step1TestCase) => {
    const wrapper = createWrapper({ step: 1 })
    Object.assign(wrapper.vm.createMandateForm, step1TestCase.initial)

    await waitForAsyncOperations()

    const ibsInputElement = wrapper
      .find('[data-testid="ibs-input-test"]')
    await ibsInputElement
      .setValue(step1TestCase.updated.ibs)

    const nameInputElement = wrapper
      .find('[data-testid="name-input-test"]')
    await nameInputElement
      .setValue(step1TestCase.updated.name)

    const siretNumberInputElement = wrapper
      .find('[data-testid="siretNumber-input-test"]')
    await siretNumberInputElement
      .setValue(step1TestCase.updated.siretNumber)

    expect(wrapper.vm.createMandateForm.ibs)
      .toStrictEqual(step1TestCase.updated.ibs)
    expect(wrapper.vm.createMandateForm.name)
      .toStrictEqual(step1TestCase.updated.name)
    expect(wrapper.vm.createMandateForm.siretNumber)
      .toStrictEqual(step1TestCase.updated.siretNumber)
  })

  it('renders the component when step value is 2', async () => {
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    wrapper.vm.createMandateForm.ibs = '1999072764'
    wrapper.vm.validateIBS({
      required: true,
      message: '',
      trigger: 'change'
    }, '1999072764', () => true)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    wrapper.vm.validateIBS({
      required: true,
      message: '',
      trigger: 'change'
    }, '199907276', () => true)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('checkAndEmitEvents when fields are not filled', async () => {
    const wrapper = createWrapper({ step: 2 })
    wrapper.vm.createMandateForm.firstName = ''
    wrapper.vm.checkAndEmitEvents()
    expect(wrapper.emitted()['loading-event-form']).toBeTruthy()
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
        key: '21'
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
        key: '2'
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
        key: '2s'
      }
    }
  ]

  it.each(step3TestCases)('renders the component when step value is 3', async (step3TestCase) => {
    const wrapper = createWrapper({ step: 3 })
    Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

    await waitForAsyncOperations()

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
