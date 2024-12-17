import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PFileCard from '.'
import type { PFileCardProps } from './PFileCardTypes'

const defaultProps: PFileCardProps = {
  pName: 'mandat-1000308253-12248236612-signature.pdf',
  pFormat: 'PDF',
  pSize: '25KB',
  pHasIcon: false,
  pHasButton: false,
}

const createWrapper = (props = defaultProps, slots: any = {}) =>
  mount(PFileCard, {
    props,
    slots,
  })

describe('pFileCard', () => {
  describe('props', () => {
    it.each([
      {
        pHasIcon: true,
        shouldHaveIconClass: true,
      },
      {
        pHasIcon: false,
        shouldHaveIconClass: false,
      },
    ])(
      'should show icon zone when pHasIcon is true',
      ({ pHasIcon, shouldHaveIconClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pHasIcon,
        })
        const hasIconClass = wrapper.find('.p-file-card__icon').exists()
        expect(hasIconClass).toBe(shouldHaveIconClass)
      },
    )

    it.each([
      {
        pHasButton: true,
        shouldHaveButtonClass: true,
      },
      {
        pHasButton: false,
        shouldHaveButtonClass: false,
      },
    ])(
      'should show button zone when pHasButton is true',
      ({ pHasButton, shouldHaveButtonClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pHasButton,
        })
        const hasButtonClass = wrapper.find('.p-file-card__group-btn').exists()
        expect(hasButtonClass).toBe(shouldHaveButtonClass)
      },
    )

    it('should renders the icon component if there is no slot', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pHasIcon: true,
      })
      const pIcon = wrapper.findComponent({ name: 'PIcon' })
      expect(pIcon.exists()).toBeTruthy()
      expect(pIcon.props('pName')).toBe('filetypePdf')
    })

    it('should renders the slot icon if set', () => {
      const wrapper = createWrapper(
        {
          ...defaultProps,
          pHasIcon: true,
        },
        {
          icon: '<p data-test-id="icon-test">Icon Text</p>',
        },
      )
      expect(wrapper.find('[data-test-id="icon-test"]').exists()).toBeTruthy()
    })

    it('should renders the text values of the component', () => {
      const wrapper = createWrapper(defaultProps)
      expect(wrapper.find('.p-file-card__name').text()).toContain(
        'mandat-1000308253-12248236612-signature.pdf',
      )
      expect(wrapper.find('.p-file-card__size').text()).toContain('PDF')
      expect(wrapper.find('.p-file-card__size').text()).toContain('25KB')
    })
  })
})
