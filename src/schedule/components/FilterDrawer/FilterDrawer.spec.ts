import { shallowMount } from '@vue/test-utils'
import FilterDrawer from '.'
import { expect, describe, it } from 'vitest'
import type { FilterDrawerProps } from './FilterDrawerTypes'
import { nextTick } from 'vue'

function createWrapper(override: Partial<FilterDrawerProps> = {}) {
  const defaultProps: FilterDrawerProps = {
    modelValue: false,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(FilterDrawer, {
    props,
  })
}

describe('test FilterDrawer', () => {
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pDrawer.props()).toBeTruthy()
  })

  it('should emit update:model-value event when drawer closes', async () => {
    const wrapper = createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    pDrawer.vm.$emit('close-drawer-button')
    await nextTick()

    expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
  })
})

