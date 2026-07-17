import { shallowMount } from '@vue/test-utils'

import PToolboxButton from './PToolboxButton.vue'
import type { PToolboxButtonProps } from './PToolboxButtonTypes'

const createWrapper = (props: Partial<PToolboxButtonProps> = {}, slot = '<span>Manage</span>') =>
  shallowMount(PToolboxButton, {
    props: { pElements: [], ...props },
    slots: { default: slot },
    global: { renderStubDefaultSlot: true },
  })

describe('PToolboxButton', () => {
  it('forwards the button type', () => {
    const wrapper = createWrapper({ pType: 'secondary' })

    expect(wrapper.findComponent({ name: 'PButton' }).props('pType')).toBe('secondary')
  })

  it('forwards any PButton prop (e.g. pLoading)', () => {
    const wrapper = createWrapper({ pLoading: true })

    expect(wrapper.findComponent({ name: 'PButton' }).props('pLoading')).toBe(true)
  })

  it('renders the button content through the default slot', () => {
    const wrapper = createWrapper({}, '<span class="custom-content">Custom</span>')

    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom')
  })

  it('forwards the toolbox item click as p-item-clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.findComponent({ name: 'PToolbox' }).vm.$emit('p-toolbox-item-clicked', 'delegate')

    expect(wrapper.emitted('p-item-clicked')).toStrictEqual([['delegate']])
  })

  it('appends the chevron after the slot', () => {
    const wrapper = createWrapper()

    expect(wrapper.findComponent({ name: 'PIcon' }).exists()).toBe(true)
  })
})
