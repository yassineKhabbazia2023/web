import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PNotificationCard from '.'

const timeText = '1sem'

const defaultProps = {
  time: timeText
}

const createWrapper = (props: any = defaultProps) =>
  mount(PNotificationCard, {
    props
  })

describe('PNotificationCard', () => {
  describe('props', () => {
    it.each([
      {
        isNew: true,
        shouldHaveNewClass: true,
        text: 'have'
      },
      {
        isNew: false,
        shouldHaveNewClass: false,
        text: 'hide'
      }
    ])('should $text new class when isNew is $isNew',
      ({ isNew, text, shouldHaveNewClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          isNew,
          text
        })
        const hasNewClass = wrapper.find('.p-notification-card--new').exists()
        expect(hasNewClass).toBe(shouldHaveNewClass)
      }
    )

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-notification-card__time').text())
        .toContain(timeText)
    })

    it('should emit action-notification-click event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.p-notification-card__button').trigger('click')
      const emittedNotificationButton = wrapper.emitted('action-notification-click')
      expect(emittedNotificationButton).toBeTruthy()
    })
  })
})
