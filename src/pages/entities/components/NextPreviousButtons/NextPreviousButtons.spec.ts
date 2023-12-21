import { describe, it, expect } from 'vitest'
import NextPreviousButtons from '.'
import { mount } from '@vue/test-utils'
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'

async function getWrapper(hasCheckIcon: boolean) {
  const wrapper = await mount(NextPreviousButtons, {
    props: {
      previousLabel: 'previous label',
      nextLabel: hasCheckIcon ? 'submit label' : 'next label',
      hasCheckIcon
    } satisfies NextPreviousButtonsProps
  })

  return wrapper
}

describe('nextPreviousButtons', () => {
  describe('props', () => {
    it('should display previousButton', async () => {
      const wrapper = await getWrapper(false)
      const previousButton = wrapper.find('[data-ut=previousButton]')
      expect(previousButton.text()).toBe('previous label')
    })
    it('should display nextButton', async () => {
      const wrapper = await getWrapper(false)
      const nextButton = wrapper.find('[data-ut=nextButton]')
      expect(nextButton.text()).toBe('next label')
    })
    it('should display check icon when hasCheckIcon prop is true', async () => {
      const wrapper = await getWrapper(true)
      const nextButton = wrapper.find('[data-ut=nextButton]')
      const checkIcon = wrapper.findComponent({ name: 'PICheck' })
      expect(checkIcon.exists()).toBeTruthy()
      expect(nextButton.text()).toBe('submit label')
    })
  })
  describe('interactions', () => {
    it("should emit 'clickPrevious' when click on previousButton", async () => {
      const wrapper = await getWrapper(false)
      const previousButton = wrapper.find('[data-ut=previousButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickPrevious')).toBeTruthy()
    })
    it("should emit 'clickNext' when click on nextButton", async () => {
      const wrapper = await getWrapper(false)
      const previousButton = wrapper.find('[data-ut=nextButton]')
      await previousButton.trigger('click')
      expect(wrapper.emitted('clickNext')).toBeTruthy()
    })
  })
})
