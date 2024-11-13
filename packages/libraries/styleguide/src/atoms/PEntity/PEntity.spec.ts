// Import necessary modules
import { mount } from '@vue/test-utils'
import PEntity from './'
import { describe, it, expect } from 'vitest'
import type { PEntityProps } from './PEntityTypes'

const content = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-entity', () => {
  it('renders with content', () => {
    const props: PEntityProps = {
      pContent: content,
      pType: 'primary',
      pSelected: false,
    }
    const wrapper = mount(PEntity, {
      props,
    })

    // Check if the cell renders correctly
    const PEntitylement = wrapper.findComponent({ name: 'PEntity' })

    expect(PEntitylement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(content)).toBeGreaterThan(-1)
  })

  it('renders with an avatar', () => {
    const props: PEntityProps = {
      pContent: content,
      pType: 'primary',
      pIconShape: 'circle',
      pIconColor: 'persian-gradient',
      pSelected: false,
    }
    const wrapper = mount(PEntity, {
      props,
    })

    // Check if the table renders correctly
    const avatarElement = wrapper.findComponent({ name: 'PAvatar' })
    expect(avatarElement.exists()).toBeTruthy()
  })
})
