import { VueWrapper, mount } from '@vue/test-utils'
// import wrapperFactory from '../../../tests/utils/wrapperFactory'
import { describe, it, expect } from 'vitest'
import PDialog from '.'
import { ElDialog } from 'element-plus'

const createWrapper = (props: any = {}, slots: any = {}) =>
  mount(PDialog, {
    props,
    slots: slots,
    global: {
      stubs: {
        ElDialog
      }
    }
  })

describe('display dialog', () => {
  it('renders the dialog component', () => {
    const wrapper: VueWrapper<any> = createWrapper({ visible: true })
    expect(wrapper.exists()).toBe(true)
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
    await wrapper.vm.handleClose()

    // Ensure the event is emitted with the correct value
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })
})

