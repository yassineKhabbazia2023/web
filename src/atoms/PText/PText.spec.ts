// Import necessary modules
import { mount } from '@vue/test-utils'
import PText from './'
import { PIPerson } from '../PIcon/components'
import { describe, it, expect } from 'vitest'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-text', () => {

  it('renders the content', () => {
    const wrapper = mount(PText, {
      props: {
        content,
        type: 'primary',
        disabled: false,
        selected: false
      }
    })

    // Check if the cell renders correctly
    const PTextElement = wrapper.findComponent({ name: 'PText' })

    expect(PTextElement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(content)).toBeGreaterThan(-1)
  })

  it('renders with an icon', () => {
    const wrapper = mount(PText, {
      props: {
        icon: PIPerson,
        content,
        type: 'primary',
        disabled: false,
        selected: false
      }
    })

    // Check if the table renders correctly
    const iconElement = wrapper.findComponent({ name: 'PIPerson' })

    expect(iconElement.exists()).toBeTruthy()
  })
})
