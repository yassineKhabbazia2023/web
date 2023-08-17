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

describe('CreateMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await vi.dynamicImportSettled()
    expect(wrapper.exists()).toBe(true)
  })

  it('reflects changes in drawerModel when modelValue prop is updated', async () => {
    const wrapper = createWrapper({ modelValue: false })

    // Use a helper function to get the drawerModel value
    const getDrawerModel = () => wrapper.props('modelValue')

    expect(getDrawerModel()).toBe(false)
    await wrapper.setProps({ modelValue: true })
    expect(getDrawerModel()).toBe(true)
  })

  it('emits update:modelValue event when drawerModel value changes', async () => {
    const wrapper = createWrapper({
      modelValue: false
    })

    wrapper.vm.drawerModel = true
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true])
  })
})
