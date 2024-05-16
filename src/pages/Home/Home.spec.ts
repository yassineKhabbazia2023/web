import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Home from '.'

const createWrapper = (): VueWrapper<any> => mount(Home)

describe('home', () => {
  it('should render the the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.homepage').exists()).toBeTruthy()
  })
})
