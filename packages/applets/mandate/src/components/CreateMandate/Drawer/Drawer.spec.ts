import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMandate } from '@mandate/services/mandate'

const createWrapper = (props: any = {}, slots: any = {}) =>
  wrapperFactory(CreateMandateDrawer, { props, slots })

const amplitudeTrackMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({}),
  }),
  amplitudeService: {
    track: amplitudeTrackMock,
  },
}))

vi.mock('@mandate/services/mandate', () => ({
  getMandateAvailability: vi.fn(),
  createMandate: vi.fn(() => {
    return Promise.resolve({
      data: { id: 'e4ec92f2-a375-4574-dssdA' },
    })
  }),
}))

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should update step navigation', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    expect(wrapper.find('.is-process').text()).toContain('1')
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('2')
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('3')
    await wrapper.find('button[data-testid="previous-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('2')
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    expect(createMandate).toHaveBeenCalledTimes(1)
    await nextTick()
    await wrapper.find('button[data-testid="close-button-test"]').trigger('click')
  })

  it('should open dialog modal before quit at step 2', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.mandateModel.erpId = '1234567890'
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    await wrapper.find('.p-drawer__close-button').trigger('click')
    expect(wrapper.find('.p-dialog__text').text())
      .toContain('You are about to exit the mandate creation path')
    await wrapper.find('button[data-testid="cancel-dialog-test"]').trigger('click')
    expect(wrapper.find('.el-drawer__body').exists()).toBeTruthy()
    await wrapper.find('.p-drawer__close-button').trigger('click')
    await wrapper.find('button[data-testid="quit-dialog-test"]').trigger('click')
    expect(wrapper.find('.p-dialog__text').exists()).toBeFalsy()
  })

  it('should emit new mandate created event', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    await nextTick()
    await wrapper.find('button[data-testid="close-button-test"]').trigger('click')
    const newMandateCreatedEvent: any = wrapper.emitted('new-mandate-created')
    expect(newMandateCreatedEvent).toBeDefined()
  })

  it('should show error display to form due to api response', async () => {
    const error: any = new Error()
    error.response = {
      data: {
        message: 'Error during mandate creattion',
      },
    }
    vi.mocked(createMandate).mockRejectedValueOnce(error)
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.currentStep = 3
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    expect(createMandate).toHaveBeenCalled()
    expect(amplitudeTrackMock).toHaveBeenCalledWith('Bank Mandate Creation Completed', {
      bank_mandate_creation_result: 'failed',
    })
  })

  it('should show error display to form due to http client issue', async () => {
    const error: any = new Error()
    error.request = 'something bad happened'
    vi.mocked(createMandate).mockRejectedValueOnce(error)
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.currentStep = 3
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    expect(createMandate).toHaveBeenCalled()
  })

  it('should show error display to form', async () => {
    const error = new Error('Something went wrong')
    vi.mocked(createMandate).mockRejectedValueOnce(error)
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.currentStep = 3
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    expect(createMandate).toHaveBeenCalled()
  })
})
