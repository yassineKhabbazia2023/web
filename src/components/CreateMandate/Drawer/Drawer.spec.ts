import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'

const createWrapper = (props: any = {}, slots: any = {}) =>
  wrapperFactory(CreateMandateDrawer, { props, slots })

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await vi.dynamicImportSettled()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('reflects changes in drawerModel when modelValue prop is updated', async () => {
    const wrapper = createWrapper({ modelValue: false })
    await vi.dynamicImportSettled()
    const getDrawerModel = () => wrapper.props('modelValue')
    expect(getDrawerModel()).toBeFalsy()
    await wrapper.setProps({ modelValue: true })
    expect(getDrawerModel()).toBeTruthy()
  })

  it('emits update:modelValue event when drawerModel value changes', async () => {
    const wrapper = createWrapper({
      modelValue: false
    })
    await vi.dynamicImportSettled()
    wrapper.vm.drawerModel = true
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([true])
  })

  it('goToNextStep when currentStep go from 1 to 2', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await vi.dynamicImportSettled()
    wrapper.vm.goToNextStep()
    expect(wrapper.vm.currentStep).toBe(2)
    expect(wrapper.vm.nextStepAvailability).toBeFalsy()
    wrapper.vm.goToNextStep()
    expect(wrapper.vm.currentStep).toBe(3)
    expect(wrapper.vm.nextStepAvailability).toBeFalsy()
  })
})
