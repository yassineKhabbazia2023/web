import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PCheckboxGroup from '.'

const createWrapper = () => mount(PCheckboxGroup)

describe('pCheckboxGroup', () => {
  it('should render the component', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.p-checkbox-group').exists()).toBeTruthy()
  })
})
