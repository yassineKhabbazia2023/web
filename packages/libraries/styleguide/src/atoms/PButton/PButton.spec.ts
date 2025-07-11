import { shallowMount } from '@vue/test-utils'
import PButton from './'
import { describe, it, expect } from 'vitest'

describe('test for PButton', () => {
  it('render correctly', () => {
    const wrapper = shallowMount(PButton)

    const PButtonElement = wrapper.findComponent({ name: 'PButton' })
    expect(PButtonElement.exists()).toBeTruthy()
  })
  it('render with props', () => {
    const wrapper = shallowMount(PButton, {
      props: {
        pCircle: true,
        pDisabled: true,
        pLoading: true,
        pSize: 'small',
        pIconOnly: true,
        pIsActive: true,
      },
    })

    const pButtonElement = wrapper.findComponent({ name: 'PButton' })
    const pButtonAttributes = pButtonElement.attributes()

    expect(pButtonElement.exists()).toBeTruthy()
    expect(pButtonAttributes.round).toBeTruthy()
    expect(pButtonAttributes.size).toBe('small')
    expect(pButtonAttributes.loading).toBeTruthy()
    expect(pButtonAttributes.disabled).toBeTruthy()
    expect(pButtonAttributes.class).toBe('p-button p-button--icon p-button--is-active')
  })
})
