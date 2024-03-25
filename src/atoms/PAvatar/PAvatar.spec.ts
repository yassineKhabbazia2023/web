import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PAvatar from '.'

const defaultProps = {
  pType: 'default',
  pColor: 'orange',
  pShape: 'circle',
}

const createWrapper = (props: any = defaultProps) =>
  mount(PAvatar, {
    props,
  })

describe('pAvatar', () => {
  describe('props', () => {
    it('should render correctly with all passed props', () => {
      const wrapper: VueWrapper = createWrapper()
      const avatarElement = wrapper.find('[data-testid=avatar]')

      expect(avatarElement.classes()).toContain(
        `el-avatar--${defaultProps.pShape}`,
      )
      expect(avatarElement.classes()).toContain(
        `p-avatar--color-${defaultProps.pColor}`,
      )
      expect(avatarElement.classes()).toContain(
        `p-avatar--type-${defaultProps.pType}`,
      )
    })

    it('should display a check icon when the avatar is selected', () => {
      const wrapper: VueWrapper = createWrapper({
        ...defaultProps,
        pType: 'small',
        pSelected: true,
      })
      const checkIconElement = wrapper.find('[data-testid=avatar-check-icon]')

      expect(checkIconElement.exists()).toBeTruthy()
    })

    it('should not display a check icon when the avatar type is not small', () => {
      const wrapper: VueWrapper = createWrapper({
        ...defaultProps,
        pSelected: true,
      })
      const checkIconElement = wrapper.find('[data-testid=avatar-check-icon]')

      expect(checkIconElement.exists()).toBeFalsy()
    })
  })
})
