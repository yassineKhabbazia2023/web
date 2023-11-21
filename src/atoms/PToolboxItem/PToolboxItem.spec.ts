import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PToolboxItem from '@/atoms/PToolboxItem'
import type { PToolboxItemProps } from './PToolboxItemTypes'

const action = 'delete'
const value = 'Hello'
const componenRootCSSClass = 'p-toolbox-item'

const defaultProps: PToolboxItemProps = {
  pValue: value,
  pActionName: action,
  pIconName: 'PIAdd',
  disabled: false,
  pState: 'default'
}

const createWrapper = (props = defaultProps) =>
  mount(PToolboxItem, {
    props
  })

describe('pToolboxItem', () => {
  describe('props', () => {
    it('should have the "default" pState by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--state-default`)
    })

    it.each([
      {
        pState: 'danger',
        expectedClassBinding: `${componenRootCSSClass}--state-danger`
      }
    ])(
      'should always bind class based on current state $pState',
      ({ pState, expectedClassBinding }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pState: pState as PToolboxItemProps['pState']
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      }
    )

    it.each([
      {
        disabled: true,
        shouldHaveDisabledAttr: true
      },
      {
        disabled: false,
        shouldHaveDisabledAttr: false
      }
    ])(
      'should have disabled attribute when disabled is true',
      ({ disabled, shouldHaveDisabledAttr }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          disabled
        })

        const hasDisabledAttr = wrapper.props('disabled')

        expect(hasDisabledAttr).toBe(shouldHaveDisabledAttr)
      }
    )

    it.each([
      {
        pIconName: 'PIAdd',
        shouldHaveIconClass: true
      },
      {
        pIconName: '',
        shouldHaveIconClass: false
      }
    ])(
      'should have Icon when Icon is set',
      async ({ pIconName, shouldHaveIconClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pIconName
        })

        await vi.dynamicImportSettled()
        const iconComponent = wrapper.findComponent({ name: pIconName })
        expect(iconComponent.exists()).toBe(shouldHaveIconClass)
      }
    )

    it('should render the action name value of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.props('pActionName')).toContain(action)
    })

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-toolbox-item__text').text())
        .toContain(value)
    })
  })
})
