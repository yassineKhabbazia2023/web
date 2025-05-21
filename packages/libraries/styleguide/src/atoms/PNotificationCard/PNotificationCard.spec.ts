import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PNotificationCard from '.'

const timeText = '1sem'

const defaultProps = {
  pTime: timeText,
}

const createWrapper = (props: any = defaultProps, slots: Record<string, any> = {}) => {
  return shallowMount(PNotificationCard, {
    props,
    slots,
  })
}

describe('pNotificationCard', () => {
  describe('props', () => {
    it.each([
      {
        isNew: true,
        shouldHaveNewClass: true,
        text: 'have',
      },
      {
        isNew: false,
        shouldHaveNewClass: false,
        text: 'hide',
      },
    ])('should $text new class when isNew is $isNew', ({ isNew, text, shouldHaveNewClass }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        pIsNew: isNew,
      })
      expect(text).toBe(text)
      const hasNewClass = wrapper.find('.p-notification-card--new').exists()
      expect(hasNewClass).toBe(shouldHaveNewClass)
    })

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-notification-card__time').text()).toContain(timeText)
    })

    it('should emit action-notification-click event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.p-notification-card__button').trigger('click')
      const emittedNotificationButton = wrapper.emitted('action-notification-click')
      expect(emittedNotificationButton).toBeTruthy()
    })

    it('renders the "tag" slot content correctly', () => {
      const wrapper = createWrapper(defaultProps, {
        tag: '<p>Test Tag</p>',
      })

      const tagElement = wrapper.find('.p-notification-card__tag')
      expect(tagElement.exists()).toBe(true)
      expect(tagElement.text()).toBe('Test Tag')
    })

    it('does not render the tag if the "tag" slot is not provided', () => {
      const wrapper = createWrapper()

      const tagElement = wrapper.find('.p-notification-card__tag')
      expect(tagElement.exists()).toBe(false)
    })
  })
})
