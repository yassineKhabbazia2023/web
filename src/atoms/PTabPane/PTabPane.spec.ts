import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTabPane from '.'
import type { PTabPaneProps } from './PTabPaneTypes'
import type { PTooltipProps } from '@/atoms/PTooltip/PTooltipTypes'
import PTabs from '@/molecules/PTabs'
import PTooltip from '@/atoms/PTooltip'

const propsValue: PTabPaneProps = {
  pLabel: 'label',
  pDisabled: false,
  pName: 'name',
  pClosable: false,
  pLazy: false,
  pTabIcon: 'PICalendarEvent',
  pTooltip: undefined
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
          :pTabIcon="props.pTabIcon"
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
        slotContent
      }
    }
  }
  return mount(Component, {
    global: {
      components: {
        PTabs,
        PTabPane,
        PTooltip
      }
    }
  })
}

describe('pTabPane', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper(propsValue, 'content')
    const component = wrapper.findComponent({ name: 'ElTabPane' })

    const expectedProps = {
      label: propsValue.pLabel,
      disabled: propsValue.pDisabled,
      name: propsValue.pName,
      closable: propsValue.pClosable,
      lazy: propsValue.pLazy
    }
    expect(component.props()).toMatchObject(expectedProps)

    expect(wrapper.find('.el-tab-pane').text()).toBe('content')
  })
  it.each([
    {
      pTabIcon: 'PICalendarEvent',
      shouldHaveIconClass: true
    },
    {
      pTabIcon: '',
      shouldHaveIconClass: false
    }
  ])('should have icon component : $shouldHaveIconClass',
    async ({ pTabIcon, shouldHaveIconClass }) => {
      const wrapper: VueWrapper<any> = createWrapper({
        ...propsValue,
        pTabIcon
      }, 'content')
      await flushPromises()
      const iconClass = wrapper.find('.p-tab-pane__icon').exists()
      expect(wrapper.findComponent({ name: pTabIcon as string })).toBeTruthy()
      expect(iconClass).toBe(shouldHaveIconClass)
    }
  )
  it.each([
    {
      pTooltip: {
        pPlacement: 'bottom',
        pContent: 'this is a tooltip',
        disabled: false
      } as PTooltipProps,
      pTabIcon: 'PICalendarEvent',
      shouldHaveTooltipClass: true
    },
    {
      pTooltip: undefined,
      pTabIcon: 'PICalendarEvent',
      shouldHaveTooltipClass: false
    }
  ])('should have Tooltip component : $shouldHaveTooltipClass',
    async ({ pTabIcon, pTooltip, shouldHaveTooltipClass }) => {
      const wrapper: VueWrapper<any> = createWrapper({
        ...propsValue,
        pTabIcon,
        pTooltip
      }, 'content')
      await flushPromises()
      expect(wrapper.find('.p-tab-pane__icon.el-tooltip__trigger').exists()).toBe(shouldHaveTooltipClass)
      expect(wrapper.find('.p-tab-pane__icon').exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: pTabIcon as string })).toBeTruthy()
    }
  )
})
