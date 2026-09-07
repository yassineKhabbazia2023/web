import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import PDialog from '.'

const createWrapper = (props: any = {}, slots: any = {}) =>
  shallowMount(PDialog, {
    props,
    slots,
    global: {
      stubs: {
        ElDialog: {
          name: 'ElDialog',
          props: ['closeOnClickModal', 'closeOnPressEscape'],
          template: '<div><slot name="header" /><slot /></div>',
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

  it('forwards the close event to the parent', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })

    wrapper.findComponent({ name: 'ElDialog' }).vm.$emit('close')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('lets the dialog close on overlay click and escape by default', () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })

    const elDialog = wrapper.findComponent({ name: 'ElDialog' })
    expect(elDialog.props('closeOnClickModal')).toBe(true)
    expect(elDialog.props('closeOnPressEscape')).toBe(true)
  })

  it('does not render a header slot when none is provided', () => {
    const wrapper: VueWrapper<any> = createWrapper({ modelValue: true })
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('forwards the header slot to the dialog when provided', () => {
    const wrapper: VueWrapper<any> = createWrapper(
      { modelValue: true },
      { header: '<h2>Custom title</h2>' },
    )

    expect(wrapper.find('h2').text()).toBe('Custom title')
  })

  it('forwards pCloseOnClickModal and pCloseOnPressEscape to the dialog', () => {
    const wrapper: VueWrapper<any> = createWrapper({
      modelValue: true,
      pCloseOnClickModal: false,
      pCloseOnPressEscape: false,
    })

    const elDialog = wrapper.findComponent({ name: 'ElDialog' })
    expect(elDialog.props('closeOnClickModal')).toBe(false)
    expect(elDialog.props('closeOnPressEscape')).toBe(false)
  })
})
