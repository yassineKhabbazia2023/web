import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PCollapse from '../../molecules/PCollapse'
import PCollapseItem from '.'
import type { PCollapseItemTypes } from './PCollapseItemTypes'
import type { IconName } from '../../types/IconName.types'

const title = 'Validated'
type PCollapseItemTypesTest = PCollapseItemTypes['pType']

const defaultProps = {
  pTitleCollapseItem: title,
}

function createWrapper(overridenProps: Partial<PCollapseItemTypes> = {}) {
  const { pType, pTitleCollapseItem, pIconName, pFullBody } = {
    ...defaultProps,
    ...overridenProps,
  }
  const Component = {
    template: `
    <PCollapse>
      <PCollapseItem
        :pType="pType"
        :pTitleCollapseItem="pTitleCollapseItem"
        :pIconName="pIconName"
        :pFullBody="pFullBody"
      />
    </PCollapse>
    `,
    data() {
      return {
        pType,
        pTitleCollapseItem,
        pIconName,
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
    const tests: {
      pIconName?: IconName
      hasIcon: boolean
      text: string
    }[] = [{
      pIconName: 'pulse',
      hasIcon: true,
      text: 'show',
    }, {
      pIconName: undefined,
      hasIcon: false,
      text: 'hide',
    }]
    it.each(tests)('should $text icon zone when icon is $hasIcon',
      async ({ pIconName, hasIcon }) => {
        const wrapper = createWrapper({ pIconName })
        const pIcon = wrapper.findComponent({ name: 'PIcon' })

        expect(pIcon.exists()).toBe(hasIcon)
        if (hasIcon) {
          expect(pIcon.props('pName')).toBe(pIconName)
        }
      },
    )

    it('should have the "default" type by default', () => {
      const wrapper = createWrapper()
      const pCollapseItem = wrapper.findComponent(PCollapseItem)
      expect(pCollapseItem.classes()).toContain('p-collapse-item--type-default')
    })

    it.each([
      {
        pType: 'default',
        expectedClassBinding: 'p-collapse-item--type-default',
      },
      {
        pType: 'shadow',
        expectedClassBinding: 'p-collapse-item--type-shadow',
      },
      {
        pType: 'alert',
        expectedClassBinding: 'p-collapse-item--type-alert',
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
