// Import necessary modules
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PText from './'
import type { PTextProps } from './PTextTypes'
import { nextTick } from 'vue'

const pContent = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'
const baseProps: PTextProps = {
  pContent,
  pType: 'primary',
  disabled: false,
  selected: false,
}

describe('tests for p-text', () => {
  it('renders the content', () => {
    const wrapper = shallowMount(PText, {
      props: baseProps,
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
        ...baseProps,
        pIconName: 'person',
      },
    })

    // Check if the table renders correctly
    const iconElement = wrapper.findComponent({ name: 'PIcon' })

    expect(iconElement.exists()).toBeTruthy()
  })

  it('binds the appropriate modifier when pUnderlinedOnHover is true', async () => {
    const wrapper = shallowMount(PText, {
      props: {
        ...baseProps,
        pIsUnderlinedOnHover: true,
      },
    })
    await nextTick()

    expect(wrapper.classes()).toContain('p-text--is-underlined-on-hover')
  })

  it('emits p-text-content-clicked when the content is clicked', async () => {
    const wrapper = shallowMount(PText, {
      props: baseProps,
    })

    const contentWrapper = wrapper.find('.p-text__content')
    await contentWrapper.trigger('click')

    expect(wrapper.emitted('p-text-content-clicked')).toHaveLength(1)
  })
})
