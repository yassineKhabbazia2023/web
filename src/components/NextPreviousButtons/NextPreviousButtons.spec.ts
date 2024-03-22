import { describe, it, expect } from 'vitest'
import NextPreviousButtons from '.'
import { mount } from '@vue/test-utils'
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'

async function getWrapper() {
  const wrapper = await mount(NextPreviousButtons, {
    props: {
      previousLabel: 'previous label',
      nextLabel: 'next label'
    } satisfies NextPreviousButtonsProps
  })

  return wrapper
}

describe('nextPreviousButtons', () => {
  describe('props', () => {
    it('should display previousButton', async () => {
      const wrapper = await getWrapper()
      const previousButton = wrapper.find('[data-testid=previousButton]')
      expect(previousButton.text()).toBe('previous label')
    })
    it('should display nextButton', async () => {
      const wrapper = await getWrapper()
      const nextButton = wrapper.find('[data-testid=nextButton]')
      expect(nextButton.text()).toBe('next label')
    })
  })
  describe('interactions', () => {
    it("should emit 'clickPrevious' when click on previousButton", async () => {
      const wrapper = await getWrapper()
      const previousButton = wrapper.find('[data-testid=previousButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickPrevious')).toBeTruthy()
    })
    it("should emit 'clickNext' when click on nextButton", async () => {
      const wrapper = await getWrapper()
      const previousButton = wrapper.find('[data-testid=nextButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickNext')).toBeTruthy()
    })
  })
})
