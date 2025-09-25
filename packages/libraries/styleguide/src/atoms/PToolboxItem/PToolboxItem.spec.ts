import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PToolboxItem from '../../atoms/PToolboxItem'
import type { PToolboxItemProps } from './PToolboxItemTypes'
import type { IconName } from '../../types/IconName.types'

const action = 'delete'
const value = 'Hello'
const componentRootCSSClass = 'p-toolbox-item'

const defaultProps: PToolboxItemProps<string> = {
  pValue: value,
  pActionName: action,
  pIconName: 'add',
  disabled: false,
  pState: 'default',
}

const createWrapper = (props = defaultProps) =>
  shallowMount(PToolboxItem, {
    props,
    global: {
      stubs: {
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
          props: ['pName'],
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
          props: ['pContent', 'disabled'],
        },
      },
    },
  })

describe('pToolboxItem', () => {
  describe('props', () => {
    it('should have the "default" pState by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componentRootCSSClass}--state-default`)
    })

    it.each([
      {
        pState: 'danger',
        expectedClassBinding: `${componentRootCSSClass}--state-danger`,
      },
    ])(
      'should always bind class based on current state $pState',
      ({ pState, expectedClassBinding }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pState: pState as PToolboxItemProps['pState'],
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      },
    )

    it.each([
      {
        disabled: true,
        shouldHaveDisabledAttr: true,
      },
      {
        disabled: false,
        shouldHaveDisabledAttr: false,
      },
    ])(
      'should have disabled attribute when disabled is true',
      ({ disabled, shouldHaveDisabledAttr }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          disabled,
        })

        const hasDisabledAttr = wrapper.props().disabled

        expect(hasDisabledAttr).toBe(shouldHaveDisabledAttr)
      },
    )

    const tests: {
      pIconName?: IconName
      shouldHaveIcon: boolean
    }[] = [{
      pIconName: 'add',
      shouldHaveIcon: true,
    }, {
      pIconName: undefined,
      shouldHaveIcon: false,
    }]
    it.each(tests)(
      'should have Icon when Icon is set',
      async ({ pIconName, shouldHaveIcon }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pIconName,
        })

        await vi.dynamicImportSettled()
        const iconComponent = wrapper.findComponent({ name: 'PIcon' })
        expect(iconComponent.exists()).toBe(shouldHaveIcon)
        if (shouldHaveIcon) {
          expect(iconComponent.props('pName')).toBe(pIconName)
        }
      },
    )

    it('should has icon when pIconName is a component', () => {
      const pIconName = 'add'
      const wrapper = createWrapper({
        ...defaultProps,
        pIconName,
      })
      const iconComponent = wrapper.findComponent({ name: 'PIcon' })
      expect(iconComponent.exists()).toBeTruthy()
      expect(iconComponent.props('pName')).toBe(pIconName)
    })

    it('should render the action name value of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.props().pActionName).toContain(action)
    })

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-toolbox-item__text').text())
        .toContain(value)
    })

    it('should render tooltip around toolbox item when tooltip content is set', () => {
      const pContentTooltip = 'Content of my tooltip'
      const wrapper = createWrapper({
        ...defaultProps,
        pContentTooltip,
      })
      const pTooltip = wrapper.findComponent({ name: 'PTooltip' })

      expect(pTooltip.props('pContent')).toBe(pContentTooltip)
    })
  })
})
