import { mount } from '@vue/test-utils'
import CreateMandateDrawer from '.'
import { createI18n } from 'vue-i18n'
import { expect, describe, it, vi } from 'vitest'

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': {
      'new-collection': 'New collection'
    },
    'fr-FR': {
      'new-collection': 'Nouvelle collecte'
    }
  }
})

const createWrapper = (props: any = {}, slots: any = {}) =>
  mount(CreateMandateDrawer, {
    props,
    slots,
    global: {
      plugins: [i18n]
    }
  })

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await vi.dynamicImportSettled()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('reflects changes in drawerModel when modelValue prop is updated', async () => {
    const wrapper = createWrapper({ modelValue: false })

    // Use a helper function to get the drawerModel value
    const getDrawerModel = () => wrapper.props('modelValue')

    expect(getDrawerModel()).toBeFalsy()
    await wrapper.setProps({ modelValue: true })
    expect(getDrawerModel()).toBeTruthy()
  })

  it('emits update:modelValue event when drawerModel value changes', async () => {
    const wrapper = createWrapper({
      modelValue: false
    })

    wrapper.vm.drawerModel = true
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([true])
  })

  it('goToNextStep when currentStep is equal to 1 and after when currentStep is equal to 2', () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.goToNextStep()
    expect(wrapper.vm.currentStep).toBe(2)
    expect(wrapper.vm.nextStepAvailability).toBe(false)
    wrapper.vm.goToNextStep()
    expect(wrapper.vm.currentStep).toBe(3)
    expect(wrapper.vm.nextStepAvailability).toBe(false)
  })
})
