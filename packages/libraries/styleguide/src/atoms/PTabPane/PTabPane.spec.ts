import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTabPane from '.'
import type { PTabPaneProps } from './PTabPaneTypes'
import type { PTooltipProps } from '../../atoms/PTooltip/PTooltipTypes'
import type { IconName } from '../../types/IconName.types'

const propsValue: PTabPaneProps = {
  pLabel: 'label',
  pDisabled: false,
  pName: 'name',
  pClosable: false,
  pLazy: false,
  pIconName: 'calendarEvent',
  pTooltip: undefined,
}

function createWrapper(props: PTabPaneProps, slotContent: string): VueWrapper {
  const Component = {
    template: `
      <PTabs
        :model-value="props.pName"
        pColor=""
        pContent=""
        pEffect="plain"
      >
        <PTabPane
          :pLabel="props.pLabel"
          :pDisabled="props.pDisabled"
          :pName="props.pName"
          :pClosable="props.pClosable"
          :pLazy="props.pLazy"
          :pIconName="props.pIconName"
          :pTooltip="props.pTooltip"
        >
          <template
            name="label"
            data-ut="slot"
            v-if="slotContent !== ''">
              {{ slotContent }}
          </template>
        </PTabPane>
      </PTabs>
    `,
    data() {
      return {
        props,
        slotContent,
      }
    },
  }
  return shallowMount(Component, {
    global: {
      stubs: {
        PTabPane,
        ElTabPane: {
          name: 'ElTabPane',
          template: '<div v-bind="$attrs"><slot /><slot name="label" /></div>',
          props: [
            'label',
            'disabled',
            'name',
            'closable',
            'lazy',
          ],
        },
        PTabs: {
          name: 'PTabs',
          template: '<div><slot /></div>',
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
          props: ['pName'],
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div class="p-tooltip"><slot /></div>',
          props: ['pContent', 'disabled'],
        },
      },
    },
  })
}

describe('pTabPane', () => {
  it('should render correctly', () => {
    const propsWithoutIcon: PTabPaneProps = {
      ...propsValue,
      pIconName: undefined,
    }
    const wrapper: VueWrapper<any> = createWrapper(propsWithoutIcon, 'content')
    const component = wrapper.findComponent({ name: 'ElTabPane' })

    const expectedProps = {
      label: propsWithoutIcon.pLabel,
      disabled: propsWithoutIcon.pDisabled,
      name: propsWithoutIcon.pName,
      closable: propsWithoutIcon.pClosable,
      lazy: propsWithoutIcon.pLazy,
    }
    expect(component.props()).toMatchObject(expectedProps)

    expect(wrapper.find('[data-testid="p-tab-pane"]').text()).toBe('content')
  })
  const tests1: {
    pIconName?: IconName
    shouldHaveIconClass: boolean
  }[] = [{
    pIconName: 'calendarEvent',
    shouldHaveIconClass: true,
  }, {
    pIconName: undefined,
    shouldHaveIconClass: false,
  }]
  it.each(tests1)('should have icon component : $shouldHaveIconClass',
    async ({ pIconName, shouldHaveIconClass }) => {
      const wrapper: VueWrapper<any> = createWrapper({
        ...propsValue,
        pIconName,
      }, 'content')
      await flushPromises()
      const iconClass = wrapper.find('.p-tab-pane__icon').exists()
      const pIcon = wrapper.findComponent({ name: 'PIcon' })
      expect(pIcon.exists()).toBe(pIconName !== undefined)
      if (pIconName !== undefined) {
        expect(pIcon.props('pName')).toBe(pIconName)
      }
      expect(iconClass).toBe(shouldHaveIconClass)
    },
  )
  const tests2: {
    pTooltip?: PTooltipProps
    pIconName: IconName
    shouldHaveTooltipClass: boolean
  }[] = [{
    pTooltip: {
      pPlacement: 'bottom',
      pContent: 'this is a tooltip',
      disabled: false,
    } as PTooltipProps,
    pIconName: 'calendarEvent',
    shouldHaveTooltipClass: true,
  }, {
    pTooltip: undefined,
    pIconName: 'calendarEvent',
    shouldHaveTooltipClass: false,
  }]
  it.each(tests2)('should have Tooltip component : $shouldHaveTooltipClass',
    async ({ pIconName, pTooltip, shouldHaveTooltipClass }) => {
      const wrapper: VueWrapper<any> = createWrapper({
        ...propsValue,
        pIconName,
        pTooltip,
      }, 'content')
      await flushPromises()
      const pTabPaneIcon = wrapper.find('[data-testid="tooltip-icon"]')

      expect(pTabPaneIcon.exists()).toBe(shouldHaveTooltipClass)

      const pTooltipElement = wrapper.findComponent({ name: 'PTooltip' })
      expect(pTooltipElement.exists()).toBe(shouldHaveTooltipClass)

      expect(wrapper.find('.p-tab-pane__icon').exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: pIconName as string })).toBeTruthy()
    },
  )
})
