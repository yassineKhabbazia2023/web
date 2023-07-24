// Import necessary modules
import { mount } from '@vue/test-utils'
import PCellText from './'
import { PIPerson } from '../PIcon/components'
import { describe, it, expect } from 'vitest'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-cell-text', () => {

  it('renders the cell with content', () => {
    const wrapper = mount(PCellText, {
      props: {
        content,
        type: 'primary',
        disabled: false,
        selected: false
      }
    })

    // Check if the cell renders correctly
    const pCellTextElement = wrapper.findComponent({ name: 'PCellText' })

    expect(pCellTextElement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(content)).toBeGreaterThan(-1)
  })

  it('renders the cell with an icon', () => {
    const wrapper = mount(PCellText, {
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
