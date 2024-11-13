import { mount } from '@vue/test-utils'
import PButtonGroup from './'
import { describe, it, expect } from 'vitest'
import PButton from '../../atoms/PButton'

describe('test for PButtonGroup', () => {
  it('render correctly', () => {
    const wrapper = mount(PButtonGroup, {
      props: {
        pType: 'default',
        pSize: 'default',
      },
      slots: {
        default: '<PButton>Button 1</PButton>',
      },
      global: {
        components: {
          PButton,
        },
      },
    })

    const PButtonElement = wrapper.findComponent({ name: 'PButtonGroup' })
    expect(PButtonElement.exists()).toBeTruthy()
    expect(wrapper.findComponent(PButton).exists()).toBeTruthy()
  })
})
