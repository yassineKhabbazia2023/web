import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
// import { flushPromises } from '@vue/test-utils'

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

  // eslint-disable-next-line vitest/no-focused-tests
  it('goToNextStep when currentStep go from 1 to 2', async () => {
    const wrapper = createWrapper({ modelValue: true })
    // const nextStepButton = wrapper.find('button[data-testid="next-step-test"]')
    // await nextStepButton.trigger('click')
    // await wrapper.vm.$nextTick()
    wrapper.vm.goToNextStep()
    await nextTick()
    expect(wrapper.vm.currentStep).toBe(2)
    expect(wrapper.vm.nextStepAvailability).toBeFalsy()
  })

  // eslint-disable-next-line vitest/no-disabled-tests
  it('renders the close when currentStep > 3', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.goToNextStep()
    await nextTick()
    wrapper.vm.goToNextStep()
    await nextTick()
    wrapper.vm.goToNextStep()
    await nextTick()
    await nextTick()
    // eslint-disable-next-line no-console
    console.log('current step value ', wrapper.vm.currentStep)
    /* // eslint-disable-next-line no-console
    console.log('wrapper step 3 ', wrapper.html()) */
    /* const closeButton = wrapper.find('button[data-testid="close-button-test"]')
    await closeButton.trigger('click') */
    expect(wrapper.vm.currentStep).toBe(1)
  })
})
