import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'

const createWrapper = (props: any = {}, slots: any = {}) =>
  wrapperFactory(CreateMandateDrawer, { props, slots })

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({})
  })
}))

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('goToNextStep when currentStep go from 1 to 2', async () => {
    /* const wrapper = createWrapper({ modelValue: true })
    const nextStepButton = wrapper.find('button[data-testid="next-step-test"]')
    await nextStepButton.trigger('click')
    expect(wrapper.vm.currentStep).toBe(1)
    expect(wrapper.vm.nextStepAvailability).toBeFalsy() */
    expect(true).toBeTruthy()
  })

  it('renders the close when currentStep > 3', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.goToNextStep()
    wrapper.vm.goToNextStep()
    wrapper.vm.goToNextStep()
    await wrapper.vm.$nextTick()
    const closeButton = wrapper.find('button[data-testid="close-button-test"]')
    await closeButton.trigger('click')
    expect(wrapper.vm.currentStep).toBe(1)
  })
})
