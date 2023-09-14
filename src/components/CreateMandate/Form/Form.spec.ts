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
    await waitForAsyncImports(50)
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    expect((input.element as HTMLInputElement).value).toBe('1234567891')
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
    await waitForAsyncImports(60)
    wrapper.vm.validateIBS = vi.fn()
    const input = wrapper.find('input[data-testid="ibs-number-test"]')
    await input.setValue('1234567891')
    await input.trigger('change')

    expect((input.element as HTMLInputElement).value).toBe('1234567891')
  })

  it('validateIBS when ibs length is not equal to 10', async () => {
    const wrapper = createWrapper({ step: 1 })
    await waitForAsyncImports(50)
    wrapper.vm.validateIBS = vi.fn()
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
    expect(wrapper.emitted()['loading-event-form']).toBeTruthy()
  })
})
