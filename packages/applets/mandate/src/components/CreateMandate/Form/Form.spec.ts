import { expect, describe, it, vi } from 'vitest'
import { loggerMock } from '@mandate/__mocks__/logger.mocks'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { getCompany } from '@mandate/services/mandate'
import CreateMandateForm from '.'

function mockMandateService(
  createMandateData: any,
  validateIbanData: any,
  getBankDetailData: any,
) {
  return {
    getCompany: vi.fn(() => createMandateData),
    validateIban: vi.fn(() => validateIbanData),
    getBankDetail: vi.fn(() => getBankDetailData),
  }
}

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@mandate/services/mandate', () => {
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
          email: 'elleuch@email.com',
        },
        address: {
          street: 'RUE DU COMMERCE',
          addressComplement: '',
          zipCode: '59590',
          city: 'RAISMES',
          country: 'FRANCE',
        },
      },
    },
    {
      valid: true,
    },
    {
      code: '123451234512344567891210',
      name: 'Banque postale',
      jeDeclare: {
        jdcPartnership: 'Partner',
      },
    },
  )
})

const createWrapper = (props: any = {}) =>
  wrapperFactory(CreateMandateForm, { props })

describe('form.vue', () => {
  it('renders the component when step value is 1', () => {
    const wrapper = createWrapper({ step: 1 })
    expect(wrapper.exists()).toBeTruthy()
  })

  const step1TestCases = [
    {
      initial: {
        erpId: '1234567891',
        name: 'Mike',
        siretNumber: '123456789',
      },
    },
  ]

  // FIXME : skipped while integrating SG in monorepo
  it.each(step1TestCases)('drawer step 1 and erpId %s, name %s and siret %s',
    async ({ initial: { erpId, name, siretNumber } }) => {
      const wrapper = createWrapper({ step: 1 })
      const ibsInputElement = wrapper
        .find('input[data-testid="ibs-number-test"]')
      await ibsInputElement
        .setValue(erpId)
      await ibsInputElement.trigger('change')
      const companyNameInputElement = wrapper
        .find('input[data-testid="name-input-test"]')
      expect((companyNameInputElement.element as
        HTMLInputElement).value).toBe(name)
      const siretNumberInputElement: any = wrapper
        .find('input[data-testid="siretNumber-input-test"]')
      expect((siretNumberInputElement.element as
        HTMLInputElement).value).toBe(siretNumber)
    })

  const step3TestCases = [
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true,
      },
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true,
      },
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '5432',
        branchCode: '5432',
        accountNumber: '0198765432',
        key: '2',
        valid: false,
      },
    },
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '5432s',
        branchCode: '5432s',
        accountNumber: '019876543,',
        key: '2s',
        valid: false,
      },
    },
  ]

  it.each(step3TestCases)('renders the component when step value is 3 (unvalid rib)',
    async (step3TestCase) => {
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

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

  it('emits the loading event form', async () => {
    const wrapper = createWrapper({ step: 1 })
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect((input.element as HTMLInputElement).value).toBe('1234567891')
    const emittedEnableDisableEvent: any = wrapper.emitted('enable-disable-next')
    expect(emittedEnableDisableEvent).toBeTruthy()
  })

  it('should disable next step button', async () => {
    const wrapper = createWrapper({ step: 1 })
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect((input.element as HTMLInputElement).value).toBe('1234567891')
    await input.setValue('')
    expect((input.element as HTMLInputElement).value).toBe('')
    const emittedEnableDisableEvent = wrapper.emitted('enable-disable-next')
    expect(emittedEnableDisableEvent).toBeTruthy()
  })

  it('renders the component when step value is 2', () => {
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('validateIBS when ibs length is equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    vi.spyOn(wrapper.vm, 'validateIBS').mockImplementation(() => true)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('1234567891')
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    vi.spyOn(wrapper.vm, 'validateIBS').mockImplementation(() => true)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('123456789')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('123456789')
  })

  const testCases = [
    ['email', 'zipcode'],
    ['seif@gmail.com', '750081'],
    ['', '750081'],
  ]

  it.each(testCases)('when step value is 2 (email: %s, zipCode: %s invalid)',
    async (email, zipCode) => {
      const wrapper = createWrapper({ step: 2 })
      const emailInput = wrapper.find('input[data-testid="email-test"]')
      await emailInput.setValue(email)
      await emailInput.trigger('blur')

      const input = wrapper.find('input[data-testid="zipCode-test"]')
      await input.setValue(zipCode)
      await input.trigger('blur')

      expect(wrapper.emitted()['enable-disable-next']).toBeTruthy()
    })
})

function mockMandateServiceGetBankDetailThrowError(
  createMandateData: any,
  validateIbanData: any,
) {
  return {
    getCompany: vi.fn(() => createMandateData),
    validateIban: vi.fn(() => validateIbanData),
    getBankDetail: vi.fn(() => {
      throw new Error('Bank not found')
    }),
  }
}

const mockGetBankDetailThrowError = () => {
  vi.mock('@mandate/services/mandate', () => {
    return mockMandateServiceGetBankDetailThrowError(
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
            email: 'elleuch@email.com',
          },
          address: {
            street: 'RUE DU COMMERCE',
            addressComplement: '',
            zipCode: '59590',
            city: 'RAISMES',
            country: 'FRANCE',
          },
        },
      },
      {
        valid: false,
      },
    )
  })
}

describe('form.vue mock getBankDetail to throw error', () => {
  const step3TestCases = [
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true,
      },
    },
  ]

  it.each(step3TestCases)('renders the component when step value is 3 getBankDetail throw error',
    async (step3TestCase) => {
      mockGetBankDetailThrowError()
      const wrapper = createWrapper({ step: 3 })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

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

describe('iBS edge case error', () => {
  const edgeCaseCollection = [
    {
      testLabel: 'IBS Not found',
      error: {
        response: { status: 404 },
      },
    },
    {
      testLabel: 'IBS out of wallet',
      error: {
        response: { status: 403 },
      },
    },
    {
      testLabel: 'Server error',
      error: {
        response: { status: 500 },
      },
    },
  ]
  it.each(edgeCaseCollection)('$testLabel', async ({ error }) => {
    const wrapper = createWrapper({ step: 1 })
    vi.mocked(getCompany).mockRejectedValueOnce(error)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    await input.trigger('change')
    expect(true).toBeTruthy()
  })
})

describe('baninking data edge cases', () => {
  const step3TestCases = [
    {
      initial: {
        institutionCode: '12345',
        branchCode: '12345',
        accountNumber: '12345678910',
        key: '12',
      },
      updated: {
        institutionCode: '543216',
        branchCode: '543218',
        accountNumber: '019876543210',
        key: '211',
      },
      expected: {
        institutionCode: '54321',
        branchCode: '54321',
        accountNumber: '01987654321',
        key: '21',
        valid: true,
      },
    },
  ]

  it.each(step3TestCases)('renders the component when step value is 3 getBankDetail',
    async (step3TestCase) => {
      // mockGetBankDetailThrowError()
      const wrapper = createWrapper({ step: 3, creationMandateError: 'Error' })
      Object.assign(wrapper.vm.createMandateForm, step3TestCase.initial)

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
        .toStrictEqual(step3TestCase.expected.institutionCode)
      expect(wrapper.vm.createMandateForm.branchCode)
        .toStrictEqual(step3TestCase.expected.branchCode)
      expect(wrapper.vm.createMandateForm.accountNumber)
        .toStrictEqual(step3TestCase.expected.accountNumber)
      expect(wrapper.vm.createMandateForm.key)
        .toStrictEqual(step3TestCase.expected.key)
    })
})
