import { VueWrapper, mount } from '@vue/test-utils'
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
  pLazy: false
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

describe('pPopper', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper(propsValue, 'content')
    const componentVM = wrapper.findComponent(ElTabPane).vm
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.name).toBe(propsValue.pName)
    expect(componentVM.closable).toBe(propsValue.pClosable)
    expect(componentVM.lazy).toBe(propsValue.pLazy)
    expect(wrapper.find('.el-tab-pane').text()).toBe('content')
  })
})
