import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
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
})
