import CreateMandateForm from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'

function mockMandateService(
  createMandateData: any,
  validateIbanData: any,
) {
  return {
    getCompany: vi.fn(() => createMandateData),
    validateIban: vi.fn(() => validateIbanData),
  }
}

vi.mock('@/services/mandate', () => {
  return mockMandateService(
    {
      data: {
        id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
        name: 'Mike',
        siretNumber: '',
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

const createWrapper = (props: any = {}) =>
  wrapperFactory(CreateMandateForm, { props })

describe('form.vue', () => {
  it('renders the component when step value is 1', () => {
    const wrapper = createWrapper({ step: 1 })
    expect(wrapper.exists()).toBeTruthy()
  })

  const step1FailTestCases = [
    {
      initial: {
        erpId: '1234567891',
        name: 'Mike',
        siretNumber: '',
      },
    },
  ]

  it.each(step1FailTestCases)('drawer failing steps step 1 and erpId %s, name %s and siret %s',
    async (step1FailTestCases) => {
      const wrapper = createWrapper({ step: 1 })
      const ibsInputElement = wrapper
        .find('input[data-testid="ibs-number-test"]')
      await ibsInputElement
        .setValue(step1FailTestCases.initial.erpId)
      await ibsInputElement.trigger('change')
      const companyNameInputElement = wrapper
        .find('input[data-testid="name-input-test"]')
      expect((companyNameInputElement.element as
          HTMLInputElement).value).toBe(step1FailTestCases.initial.name)
      const siretNumberInputElement: any = wrapper
        .find('input[data-testid="siretNumber-input-test"]')
      expect((siretNumberInputElement.element as
          HTMLInputElement).value).toBe(step1FailTestCases.initial.siretNumber)
      expect(wrapper.emitted('enable-disable-next')![0]).toStrictEqual([false])
    })
})
