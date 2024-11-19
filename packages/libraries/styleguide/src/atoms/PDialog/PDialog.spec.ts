import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDialog from '.'

const createWrapper = (props: any = {}, slots: any = {}) =>
  shallowMount(PDialog, {
    props,
    slots,
    global: {
      stubs: {
        ElDialog: {
          name: 'ElDialog',
          template: '<div><slot /></div>',
        },
      },
    },
  })

describe('display dialog', () => {
  it('renders the dialog component', () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('emits an update:modelValue event on close', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })

    // Simulate the close event
    wrapper.findComponent({ name: 'ElDialog' }).vm.$emit('close')

    // Wait for Vue to update the DOM
    await wrapper.vm.$nextTick()

    // Ensure the event is emitted with the correct value
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toStrictEqual([false])
  })
})

