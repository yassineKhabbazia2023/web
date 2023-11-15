import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDrawer from '.'
import { ElDrawer } from 'element-plus'

const createWrapper = (props: any = {}, slots: any = {}) =>
  mount(PDrawer, {
    props,
    slots,
    global: {
      stubs: {
        ElDrawer
      }
    }
  })

describe('drawer', () => {
  it('should renders the drawer component header in stepper mode', () => {
    const wrapper: VueWrapper<any> = createWrapper({
      modelValue: true,
      pTitle: 'Drawer title',
      pShowPreviousStep: true,
      pSize: '50%'
    })
    expect(wrapper.find('header').text()).toContain('Drawer title')
    expect(wrapper.find('.p-drawer__close-button')).toBeDefined()
    expect(wrapper.find('.p-drawer__step-back-button')).toBeDefined()
  })

  it('should renders the drawer component header in simple mode', () => {
    const wrapper: VueWrapper<any> = createWrapper({
      modelValue: true,
      pTitle: 'Drawer title'
    })
    expect(wrapper.find('header').text()).toContain('Drawer title')
    expect(wrapper.find('.p-drawer__close-button')).toBeDefined()
    expect(wrapper.find('.p-drawer__step-back-button').exists()).toBeFalsy()
  })

  it('should emit drawer-previous-button-click event', async () => {
    const wrapper: VueWrapper<any> = createWrapper({
      modelValue: true,
      pTitle: 'Drawer title',
      pShowPreviousStep: true
    })
    await wrapper.find('.p-drawer__step-back-button').trigger('click')
    const emittedDrawerPreviousButton: any = wrapper.emitted('drawer-previous-button-click')
    expect(emittedDrawerPreviousButton).toBeTruthy()
  })

  it('should emit close-drawer-button event', async () => {
    const wrapper: VueWrapper<any> = createWrapper({
      modelValue: true,
      pTitle: 'Drawer title'
    })
    await wrapper.find('.p-drawer__close-button').trigger('click')
    const emittedModelValue: any = wrapper.emitted('close-drawer-button')
    expect(emittedModelValue).toBeTruthy()
  })
})
