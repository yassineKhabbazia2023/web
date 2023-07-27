import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PToolboxItem from '@/atoms/PToolboxItem'

type PToolboxItemProps = {
  value: string | number;
  hasIcon?: boolean;
  disabled?: boolean;
};

const defaultProps: PToolboxItemProps = {
  value: 'Hello',
  hasIcon: false,
  disabled: false
}

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PToolboxItem, {
    props
  })

describe('pToolboxItem', () => {
  describe('props', () => {
    it('should show icon zone when hasIcon is true', () => {
      const wrapper = createWrapper({
        value: 'Hello',
        hasIcon: true
      })
      expect(wrapper.find('.p-toolbox-item__icon').exists()).toBeTruthy()
    })

    it('should  not show icon zone when hasIcon is false', () => {
      const wrapper = createWrapper({
        value: 'Hello',
        hasIcon: false
      })
      expect(wrapper.find('.p-toolbox-item__icon').exists()).toBeFalsy()
    })

    it.each([
      {
        disabled: true,
        shouldHaveDisabledClass: true
      },
      {
        disabled: false,
        shouldHaveDisabledClass: false
      }
    ])(
      'should have disabled class when disabled is true',
      ({ disabled, shouldHaveDisabledClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          disabled
        })

        const hasDisabledClass = wrapper.classes().includes('disabled')

        expect(hasDisabledClass).toBe(shouldHaveDisabledClass)
      }
    )
  })
})
