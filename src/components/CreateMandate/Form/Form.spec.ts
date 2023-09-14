import CreateMandateForm from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import { createMandate } from '@/services/mandate'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

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
  wrapperFactory(CreateMandateForm, { props })

describe('form.vue', () => {
  it('renders the component when step value is 1', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(10)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('emits the loading event form', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(30)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect(input.element.value).toBe('1234567891')
    const emittedLoadingEvent: any = wrapper.emitted('loading-event-form')
    expect(emittedLoadingEvent).toBeTruthy()
    expect(createMandate).toHaveBeenCalled()
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
})
