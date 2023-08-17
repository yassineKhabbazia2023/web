// Import necessary modules
import { mount } from '@vue/test-utils'
import PDoubleText from './'
import { PIFiletypePdf } from '../PIcon/components'
import { describe, it, expect } from 'vitest'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-double-text', () => {

  it('renders with content', () => {
    const wrapper = mount(PDoubleText, {
      props: {
        icon: PIFiletypePdf,
        profile: 'FL',
        title: 'Cell title',
        content,
        type: 'primary',
        disabled: false,
        selected: false
      }
    })

    // Check if the cell renders correctly
    const PDoubleTextElement = wrapper.findComponent({ name: 'PDoubleText' })

    expect(PDoubleTextElement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(content)).toBeGreaterThan(-1)
  })

  it('renders with an icon', () => {
    const wrapper = mount(PDoubleText, {
      props: {
        icon: PIFiletypePdf,
        profile: 'FL',
        title: 'Cell title',
        content,
        type: 'primary',
        disabled: false,
        selected: false
      }
    })

    // Check if the table renders correctly
    const iconElement = wrapper.findComponent({ name: 'PIFiletypePdf' })

    expect(iconElement.exists()).toBeTruthy()
  })
})
