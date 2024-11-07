import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import PRadioCard from './'

let wrapper: VueWrapper

const PROPS = {
  pDescription: 'the description',
  pLabel: 'label',
  pTitle: 'the title',
}

const SLOT_CONTENT = 'the slot content as CTA'

const createWrapper = (): VueWrapper =>
  mount(PRadioCard, {
    props: PROPS,
    slots: {
      default: SLOT_CONTENT,
    },
  })

describe('pRadioCard', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has props', () => {
    const title = wrapper.find('.h4')
    expect(title.text()).toBe(PROPS.pTitle)

    const description = wrapper.find('.p-radio-card__description')
    expect(description.text()).toBe(PROPS.pDescription)

    const input = wrapper.find('input')
    expect(input.attributes('value')).toBe(PROPS.pLabel)
  })

  it('has a slot', () => {
    const slotWrapper = wrapper.find('.p-radio-card__cta')
    expect(slotWrapper.text()).toBe(SLOT_CONTENT)
  })
})
