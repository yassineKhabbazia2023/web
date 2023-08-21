import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PFileCard from '.'
import type { PFileCardProps } from './PFileCardProps'

const defaultProps: PFileCardProps = {
  name: 'mandat-1000308253-12248236612-signature.pdf',
  format: 'PDF',
  size: '25KB',
  hasIcon: false,
  hasButton: false
}

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PFileCard, {
    props
  })

describe('pFileCard', () => {
  describe('props', () => {
    it.each([
      {
        hasIcon: true,
        shouldHaveIconClass: true
      },
      {
        hasIcon: false,
        shouldHaveIconClass: false
      }
    ])('should show icon zone when hasIcon is true', ({ hasIcon, shouldHaveIconClass }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        hasIcon
      })
      const hasIconClass = wrapper.find('.p-file-card__icon').exists()
      expect(hasIconClass).toBe(shouldHaveIconClass)
    })

    it.each([
      {
        hasButton: true,
        shouldHaveButtonClass: true
      },
      {
        hasButton: false,
        shouldHaveButtonClass: false
      }
    ])('should show button zone when hasButton is true', ({ hasButton, shouldHaveButtonClass }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        hasButton
      })
      const hasButtonClass = wrapper.find('.p-file-card__group-btn').exists()
      expect(hasButtonClass).toBe(shouldHaveButtonClass)
    })

    it('should renders the text values of the component', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.p-file-card__name').text())
        .toContain('mandat-1000308253-12248236612-signature.pdf')
      expect(wrapper.find('.p-file-card__size').text()).toContain('PDF')
      expect(wrapper.find('.p-file-card__size').text()).toContain('25KB')
    })
  })
})
