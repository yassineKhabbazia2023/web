import { mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import FilterOption from '.'
import { IProps } from './types'
import { PIArrowUpCircle } from '@kpmg/styleguide'
const createWrapper = (props: IProps) =>
  mount(FilterOption, {
    props
  })

describe('tags', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper({
      color: 'warning',
      content: 'to debloyed',
      icon: PIArrowUpCircle,
      isSelected: false,
      number: 0
    })
  })
  it('renders tagWrapper correctly', () => {
    const filterOption = wrapper.findComponent('.filter-option')
    expect(filterOption.exists()).toBeTruthy()
  })

  it('should have a selected class when the isSelected is true', async () => {
    await wrapper.setProps({ isSelected: true })
    const filterOption = wrapper.findComponent('.filter-option--is-selected')
    expect(filterOption.exists()).toBeTruthy()

  })

  it('should emit event click when clicking on the component', async () => {
    const filterOption = wrapper.findComponent('.filter-option')
    await filterOption.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should emit event close when the component is already selected', async () => {
    await wrapper.setProps({ isSelected: true })
    const filterOption = wrapper.findComponent('.filter-option--is-selected') as VueWrapper
    await filterOption.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
