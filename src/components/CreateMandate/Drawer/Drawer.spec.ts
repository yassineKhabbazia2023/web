import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import CreateMandateDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMandate } from '@/services/mandate'

const createWrapper = (props: any = {}, slots: any = {}) =>
  wrapperFactory(CreateMandateDrawer, { props, slots })

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({})
  })
}))

vi.mock('@/services/mandate', () => ({
  createMandate: vi.fn(() => {
    return Promise.resolve({
      data: { id: 'e4ec92f2-a375-4574-dssdA' }
    })
  })
}))

describe('createMandateDrawer.vue', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should update step navigation', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    expect(wrapper.find('.is-process').text()).toContain('1')
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('2')
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('3')
    await wrapper.find('button[data-testid="previous-step-test"]').trigger('click')
    expect(wrapper.find('.is-process').text()).toContain('2')
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    wrapper.vm.validateAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="validate-step-test"]').trigger('click')
    expect(createMandate).toHaveBeenCalledTimes(1)
    await nextTick()
    await wrapper.find('button[data-testid="close-button-test"]').trigger('click')
  })

  it('should open dialog modal before quit at step 2', async () => {
    const wrapper = createWrapper({ modelValue: true })
    wrapper.vm.nextStepAvailability = true
    await nextTick()
    await wrapper.find('button[data-testid="next-step-test"]').trigger('click')
    await wrapper.find('.p-drawer__close-button').trigger('click')
    expect(wrapper.find('.p-dialog__text').text())
      .toContain('You are about to exit the mandate creation path')
    await wrapper.find('button[data-testid="cancel-dialog-test"]').trigger('click')
    expect(wrapper.find('.el-drawer__body').exists()).toBeTruthy()
    await wrapper.find('.p-drawer__close-button').trigger('click')
    await wrapper.find('button[data-testid="quit-dialog-test"]').trigger('click')
    expect(wrapper.find('.p-dialog__text').exists()).toBeFalsy()
  })
})
