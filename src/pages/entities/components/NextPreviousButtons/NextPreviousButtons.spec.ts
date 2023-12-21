import { describe, it, expect, beforeEach } from 'vitest'
import NextPreviousButtons from '.'
import { mount, type VueWrapper } from '@vue/test-utils'
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'

describe('nextPreviousButtons', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = await mount(NextPreviousButtons, {
      props: {
        previousLabel: 'previous label',
        nextLabel: 'next label'
      } satisfies NextPreviousButtonsProps
    })
  })

  describe('props', () => {
    it('should display previousButton', () => {
      const previousButton = wrapper.find('[data-ut=previousButton]')
      expect(previousButton.text()).toBe('previous label')
    })
    it('should display nextButton', () => {
      const nextButton = wrapper.find('[data-ut=nextButton]')
      expect(nextButton.text()).toBe('next label')
    })
  })
  describe('interactions', () => {
    it('should emit \'clickPrevious\' when click on previousButton', async () => {
      const previousButton = wrapper.find('[data-ut=previousButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickPrevious')).toBeTruthy()
    })
    it('should emit \'clickNext\' when click on nextButton', async () => {
      const previousButton = wrapper.find('[data-ut=nextButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickNext')).toBeTruthy()
    })
  })
})
