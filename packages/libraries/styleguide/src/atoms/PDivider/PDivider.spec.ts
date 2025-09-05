import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDivider from '.'

const defaultProps = {
  pBorderStyle: 'solid',
  pDirection: 'horizontal',
  pContentPosition: 'center',
  pBorderColor: 'gray-100',
}

const createWrapper = (props: any = defaultProps) =>
  shallowMount(PDivider, {
    props,
    global: {
      stubs: {
        ElDivider: {
          name: 'ElDivider',
          template: '<div data-testid="el-divider-stub"><slot /></div>',
        },
      },
    },
  })

describe('pDivider', () => {
  describe('props', () => {
    it('should render the the component with good classes', () => {
      const wrapper = createWrapper()
      const divider = wrapper.find('[data-testid="el-divider-stub"]')

      expect(divider.attributes('direction')).toBe('horizontal')
      expect(divider.attributes('contentposition')).toBe('center')
    })
    it('should render the the component with good style', () => {
      const wrapper = createWrapper()
      const divider = wrapper.find('[data-testid="el-divider-stub"]')

      expect(divider.attributes('style')).toContain('--el-border-color: var(--p-gray-100);')
    })
  })
})
