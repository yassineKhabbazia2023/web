import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDivider from '.'

const defaultProps = {
  pBorderStyle: 'solid',
  pDirection: 'horizontal',
  pContentPosition: 'center',
  pBorderColor: 'neutral-gray-100',
}

const createWrapper = (props: any = defaultProps) =>
  mount(PDivider, {
    props,
  })

describe('pDivider', () => {
  describe('props', () => {
    it('should render the the component with good classes', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.el-divider--horizontal').exists()).toBeTruthy()
      expect(wrapper.find('.el-divider__text.is-center').exists()).toBeTruthy()
    })
    it('should render the the component with good style', () => {
      const wrapper = createWrapper()

      const divider = wrapper.find('.el-divider')

      expect(divider.attributes('style')).toContain('--el-border-style: solid;')
      expect(divider.attributes('style')).toContain('--el-border-color: var(--el-color-neutral-gray-100);')
    })
  })
})
