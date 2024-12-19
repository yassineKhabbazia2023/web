// Import necessary modules
import { shallowMount } from '@vue/test-utils'
import PText from './'
import { PIPerson } from '../PIcon/components'
import { describe, it, expect } from 'vitest'
import { markRaw } from 'vue'

const pContent = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-text', () => {
  it('renders the content', () => {
    const wrapper = shallowMount(PText, {
      props: {
        pContent,
        pType: 'primary',
        disabled: false,
        selected: false,
      },
    })

    // Check if the cell renders correctly
    const PTextElement = wrapper.findComponent({ name: 'PText' })

    expect(PTextElement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(pContent)).toBeGreaterThan(-1)
  })

  it('renders with an icon', () => {
    const wrapper = shallowMount(PText, {
      props: {
        pIconName: 'person',
        pContent,
        pType: 'primary',
        disabled: false,
        selected: false,
      },
    })

    // Check if the table renders correctly
    const iconElement = wrapper.findComponent({ name: 'PIcon' })

    expect(iconElement.exists()).toBeTruthy()
  })
})
