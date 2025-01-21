import { describe, it, expect } from 'vitest'
import NextPreviousButtons from '.'
import { mount } from '@vue/test-utils'
import type { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'

function getWrapper() {
  const wrapper = mount(NextPreviousButtons, {
    props: {
      previousLabel: 'previous label',
      nextLabel: 'next label',
    } satisfies NextPreviousButtonsProps,
  })

  return wrapper
}

describe('nextPreviousButtons', () => {
  describe('props', () => {
    it('should display previousButton', () => {
      const wrapper = getWrapper()
      const previousButton = wrapper.find('[data-testid=previousButton]')
      expect(previousButton.text()).toBe('previous label')
    })
    it('should display nextButton', () => {
      const wrapper = getWrapper()
      const nextButton = wrapper.find('[data-testid=nextButton]')
      expect(nextButton.text()).toBe('next label')
    })
  })
  describe('interactions', () => {
    it("should emit 'click-previous' when click on previousButton", async () => {
      const wrapper = getWrapper()
      const previousButton = wrapper.find('[data-testid=previousButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('click-previous')).toBeTruthy()
    })
    it("should emit 'click-next' when click on nextButton", async () => {
      const wrapper = getWrapper()
      const previousButton = wrapper.find('[data-testid=nextButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('click-next')).toBeTruthy()
    })
  })
})
