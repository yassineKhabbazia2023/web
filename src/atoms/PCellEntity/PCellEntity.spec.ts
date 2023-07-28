// Import necessary modules
import { mount } from '@vue/test-utils'
import PCellEntity from './'
import { describe, it, expect } from 'vitest'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-cell-entity', () => {
  it('renders the cell with content', () => {
    const wrapper = mount(PCellEntity, {
      props: {
        content,
        type: 'primary',
        selected: false
      }
    })

    // Check if the cell renders correctly
    const pCellEntitylement = wrapper.findComponent({ name: 'PCellEntity' })

    expect(pCellEntitylement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(content)).toBeGreaterThan(-1)
  })

  it('renders the cell with an avatar', () => {
    const wrapper = mount(PCellEntity, {
      props: {
        content,
        type: 'primary',
        iconShape: 'circle',
        iconColor: 'persian-gradient',
        iconSize: 'xsmall',
        selected: false
      }
    })

    // Check if the table renders correctly
    const avatarElement = wrapper.findComponent({ name: 'PAvatar' })
    expect(avatarElement.exists()).toBeTruthy()
  })
})
