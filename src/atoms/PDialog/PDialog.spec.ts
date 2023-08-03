import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDialog from '.'
import { ElDialog } from 'element-plus'

const createWrapper = (props: any = {}, slots: any = {}) =>
  mount(PDialog, {
    props,
    slots,
    global: {
      stubs: {
        ElDialog
      }
    }
  })

describe('display dialog', () => {
  it('renders the dialog component', () => {
    const wrapper: VueWrapper<any> = createWrapper({ visible: true })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders slot content', () => {
    const slotContent = 'Slot Content Here'
    const wrapper: VueWrapper<any> = createWrapper({
      visible: true
    },
    {
      default: slotContent
    })

    // Find the ElDialog component
    wrapper.findComponent(ElDialog)
  })

  it('emits an update:visible event on close', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ visible: true })

    // Simulate the close event
    wrapper.findComponent({ name: 'ElDialog' }).vm.$emit('close')

    // Wait for Vue to update the DOM
    await wrapper.vm.$nextTick()

    // Ensure the event is emitted with the correct value
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })
})

