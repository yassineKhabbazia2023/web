import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Header from '.'
import { expect, describe, it, vi } from 'vitest'
import Drawer from '@/components/CreateMandate/Drawer'

const createWrapper = () =>
  wrapperFactory(Header)

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ([]),
  }),
}))

describe('header.vue', () => {
  const wrapper = createWrapper()
  it('renders translations correctly', () => {
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('show drawer when button is clicked', async () => {
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeTruthy()
  })

  it('show emit refresh-mandate-collection', async () => {
    await wrapper.find('.header__create-mandate-button').trigger('click')
    wrapper.findComponent(Drawer).vm.$emit('new-mandate-crated')
    const refreshMandateCollectionEvent: any = wrapper.emitted('refresh-mandate-collection')
    expect(refreshMandateCollectionEvent).toBeDefined()
  })
})
