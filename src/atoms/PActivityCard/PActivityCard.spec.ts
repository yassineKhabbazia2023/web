import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PActivityCard from '.'

const timeText = '16 septembre 2023 - 15:13:08'
const lengthTrimValue = 2

const defaultProps = {
  pTime: timeText,
  pInitials: 'AB'
}

const createWrapper = (props: any = defaultProps) =>
  mount(PActivityCard, {
    props
  })

describe('pActivityCard', () => {
  describe('props', () => {
    it.each([
      {
        pInitials: 'AB',
        lengthTrim: lengthTrimValue
      },
      {
        pInitials: 'Abcdefgh',
        lengthTrim: lengthTrimValue
      }
    ])('should have the length of initials : $lengthTrim',
      ({ pInitials, lengthTrim }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pInitials
        })
        const initialsTrimLength = wrapper.find('.p-activity-card__avatar .p-avatar').text().length
        expect(initialsTrimLength).toBe(lengthTrim)
      }
    )

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-activity-card__time').text())
        .toContain(timeText)
    })
  })
})
