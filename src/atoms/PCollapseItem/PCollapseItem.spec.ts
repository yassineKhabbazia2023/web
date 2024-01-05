import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PCollapseItem from './'
import { PIPulse } from '@/atoms/PIcon/components'
import type { PCollapseItemTypes } from './PCollapseItemTypes'

const title = 'Validated'
type PCollapseItemTypesTest = PCollapseItemTypes['pType']
const componenRootCSSClass = 'p-collapse-item'

const defaultProps = {
  pType: 'default',
  pTitleCollapseItem: title
}

const createWrapper = (props: any = defaultProps) =>
  mount(PCollapseItem, {
    props
  })

describe('pCollapseItem', () => {
  describe('props', () => {
    it.each([
      {
        pIcon: PIPulse,
        hasIcon: true,
        text: 'show'
      },
      {
        pIcon: '',
        hasIcon: false,
        text: 'hide'
      }
    ])('should $text icon zone when icon is $hasIcon',
      async ({ pIcon, hasIcon, text }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pIcon,
          hasIcon,
          text
        })
        await flushPromises()
        const hasIconClass = wrapper.find('.p-collapse-item__icon').exists()
        const hasIconComponent = wrapper.findComponent({ name: 'PIPulse' }).exists()
        expect(hasIconClass).toBe(hasIcon)
        expect(hasIconComponent).toBe(hasIcon)
      }
    )

    it('should have the "default" type by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--type-default`)
    })

    it.each([
      {
        pType: 'default',
        expectedClassBinding: `${componenRootCSSClass}--type-default`
      },
      {
        pType: 'shadow',
        expectedClassBinding: `${componenRootCSSClass}--type-shadow`
      },
      {
        pType: 'alert',
        expectedClassBinding: `${componenRootCSSClass}--type-alert`
      }
    ])(
      'should always bind class based on current type',
      ({ pType, expectedClassBinding }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pType: pType as PCollapseItemTypesTest
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      }
    )

    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-collapse-item__title').text())
        .toContain(title)
    })
  })
})
