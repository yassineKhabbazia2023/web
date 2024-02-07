import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElTabPane } from 'element-plus'
import PTabPane from '.'
import type { PTabPaneProps } from './PTabPaneTypes'
import PTabs from '@/molecules/PTabs'

const propsValue: PTabPaneProps = {
  pLabel: 'label',
  pDisabled: false,
  pName: 'name',
  pClosable: false,
  pLazy: false,
  pTabIcon: 'PICalendarEvent'
}

function createWrapper(props: PTabPaneProps, slotContent: string): VueWrapper {
  const Component = {
    template: `
      <PTabs>
        <PTabPane 
          :pLabel="props.pLabel" 
          :pDisabled="props.pDisabled"
          :pName="props.pName"
          :pClosable="props.pClosable"
          :pLazy="props.pLazy"
          :pTabIcon="props.pTabIcon"
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
        PTabPane
      }
    }
  })
}

describe('pTabPane', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper(propsValue, 'content')
    const componentVM = wrapper.findComponent(ElTabPane).vm
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.name).toBe(propsValue.pName)
    expect(componentVM.closable).toBe(propsValue.pClosable)
    expect(componentVM.lazy).toBe(propsValue.pLazy)
    expect(wrapper.find('.el-tab-pane').text()).toBe('content')
  })
  it('should render icon on tabs correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper(propsValue, 'content')
    await flushPromises()
    expect(wrapper.find('.p-tab-pane__icon')).toBeTruthy()
    expect(wrapper.findComponent({ name: propsValue.pTabIcon as string })).toBeTruthy()
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
      expect(iconClass).toBe(shouldHaveIconClass)
    }
  )
})
