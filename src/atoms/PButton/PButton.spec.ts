import { mount } from '@vue/test-utils'
import PButton from './'
import { describe, it, expect } from 'vitest'

describe('test for PButton', () => {
  it('render correctly', () => {
    const wrapper = mount(PButton)

    const PButtonElement = wrapper.findComponent({ name: 'PButton' })
    expect(PButtonElement.exists()).toBeTruthy()
  })
  it('render with props', () => {
    const wrapper = mount(PButton, {
      props: {
        pRound: true,
        pCircle: true,
        pDisabled: true,
        pLoading: true,
        pSize: 'small'
      }
    })

    const PButtonElement = wrapper.findComponent({ name: 'PButton' })

    expect(PButtonElement.exists()).toBeTruthy()
    expect(wrapper.find('.is-round').exists()).toBeTruthy()
    expect(wrapper.find('.el-button--small').exists()).toBeTruthy()
    expect(wrapper.find('.is-loading').exists()).toBeTruthy()
    expect(wrapper.find('.is-circle').exists()).toBeTruthy()
    expect(wrapper.find('.is-disabled').exists()).toBeTruthy()
  })
})
