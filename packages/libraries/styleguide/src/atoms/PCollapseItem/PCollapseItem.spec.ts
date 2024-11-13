import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PCollapse from '../../molecules/PCollapse'
import { PIPulse } from '../../atoms/PIcon/components'
import PCollapseItem from '.'
import type { PCollapseItemTypes } from './PCollapseItemTypes'

const title = 'Validated'
type PCollapseItemTypesTest = PCollapseItemTypes['pType']
const componenRootCSSClass = 'p-collapse-item'

const defaultProps = {
  pTitleCollapseItem: title,
}

function createWrapper(overridenProps: Partial<PCollapseItemTypes> = {}) {
  const { pType, pTitleCollapseItem, pIcon, pFullBody } = {
    ...defaultProps,
    ...overridenProps,
  }
  const Component = {
    template: `
    <PCollapse>
      <PCollapseItem
        :pType="pType"
        :pTitleCollapseItem="pTitleCollapseItem"
        :pIcon="pIcon"
        :pFullBody="pFullBody"
      />
    </PCollapse>
    `,
    data() {
      return {
        pType,
        pTitleCollapseItem,
        pIcon,
        pFullBody,
      }
    },
  }

  return mount(Component, {
    global: {
      components: {
        PCollapse,
        PCollapseItem,
      },
    },
  })
}

describe('pCollapseItem', () => {
  describe('props', () => {
    it.each([
      {
        pIcon: PIPulse,
        hasIcon: true,
        text: 'show',
      },
      {
        pIcon: '',
        hasIcon: false,
        text: 'hide',
      },
    ])('should $text icon zone when icon is $hasIcon',
      async ({ pIcon, hasIcon }) => {
        const wrapper = createWrapper({ pIcon })
        await flushPromises()
        const hasIconClass = wrapper.find('.p-collapse-item__icon').exists()
        const hasIconComponent = wrapper.findComponent({ name: 'PIPulse' }).exists()
        expect(hasIconClass).toBe(hasIcon)
        expect(hasIconComponent).toBe(hasIcon)
      },
    )

    it('should have the "default" type by default', () => {
      const wrapper = createWrapper()
      const pCollapseItem = wrapper.findComponent(PCollapseItem)
      expect(pCollapseItem.classes()).toContain(`${componenRootCSSClass}--type-default`)
    })

    it.each([
      {
        pType: 'default',
        expectedClassBinding: `${componenRootCSSClass}--type-default`,
      },
      {
        pType: 'shadow',
        expectedClassBinding: `${componenRootCSSClass}--type-shadow`,
      },
      {
        pType: 'alert',
        expectedClassBinding: `${componenRootCSSClass}--type-alert`,
      },
    ])(
      'should always bind class based on current type',
      ({ pType, expectedClassBinding }) => {
        const wrapper = createWrapper({ pType: pType as PCollapseItemTypesTest })
        const pCollapseItem = wrapper.findComponent(PCollapseItem)
        expect(pCollapseItem.classes()).toContain(expectedClassBinding)
      },
    )

    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-collapse-item__title').text())
        .toContain(title)
    })

    it('should have a fullbody class when the pFullbody is true', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pFullBody: true,
      })

      expect(wrapper.find('.p-collapse-item--fullbody').exists()).toBeTruthy()
    })
  })
})
