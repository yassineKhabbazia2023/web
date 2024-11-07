import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { PFilterOptionProps } from './PFilterOptionTypes'
import PFilterOption from '.'
import { PIArrowUpCircle } from '@styleguide/atoms/PIcon/components'

const defaultProps: PFilterOptionProps = {
  pColor: 'warning',
  pContent: 'to deployed',
  pIcon: PIArrowUpCircle,
  pSelected: false,
  pDisabled: false,
  pValue: 0,
}

const createWrapper = (props: any = defaultProps) =>
  mount(PFilterOption, {
    props,
  })

describe('filterOption', () => {
  it('renders filterOption correctly', () => {
    const wrapper = createWrapper()
    const filterOption = wrapper.findComponent('.p-filter-option')
    expect(filterOption.exists()).toBeTruthy()
  })

  it('should have a selected class when the pSelected is true', async () => {
    const wrapper = createWrapper()
    await wrapper.setProps({ pSelected: true })
    const filterOption = wrapper.findComponent('.p-filter-option--selected')
    expect(filterOption.exists()).toBeTruthy()
  })

  it('should have a disabled class when the pDisabled is true and pcolor change', () => {
    const wrapper = createWrapper({
      ...defaultProps,
      pDisabled: true,
    })
    const filterOption = wrapper.findComponent('.p-filter-option--disabled')
    const tag = wrapper.find('.p-filter-option__tag')
    expect(tag.attributes('pcolor')).toBe('gray-500')
    expect(filterOption.exists()).toBeTruthy()
  })

  it('should emit event update:p-selected=true when clicking on the component', () => {
    const wrapper = createWrapper()
    wrapper.trigger('click')
    expect(wrapper.emitted('update:p-selected')).toStrictEqual([[true]])
  })

  it('should emit event update:p-selected=false when the component is already selected', () => {
    const wrapper = createWrapper({
      ...defaultProps,
      pSelected: true,
    })
    wrapper.trigger('click')
    expect(wrapper.emitted('update:p-selected')).toStrictEqual([[false]])
  })

  it('should render the text values of the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.p-filter-option__number').text())
      .toContain(0)
  })
})
