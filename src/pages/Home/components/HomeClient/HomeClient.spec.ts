import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HomeClient from '.'

const createWrapper = (): VueWrapper<any> => mount(HomeClient)

describe('homeclient', () => {
  it('should render the the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.client-home').exists()).toBeTruthy()
  })
})
