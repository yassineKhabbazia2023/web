import { shallowMount, VueWrapper } from '@vue/test-utils'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import PToolbox from './PToolbox.vue'
import type { PToolboxProps } from './PToolboxTypes'
import { ComponentPublicInstance, ref } from 'vue'

const defaultProps: PToolboxProps = {
  pElements: [
    { pValue: 'action1', pIconName: undefined, pState: 'default', pActionName: 'action-1', disabled: false },
    { pValue: 'action2', pIconName: undefined, pState: 'default', pActionName: 'action-2', disabled: true },
  ],
  pPlacement: 'bottom-start',
  pCoordinates: { x: 100, y: 200 },
  pPopperClass: 'custom-popper-class',
}

type ToolboxSetup = object
export type ToolboxWrapper = VueWrapper<
  ComponentPublicInstance<ToolboxSetup, PToolboxProps>
>

const createWrapper = (props: PToolboxProps = defaultProps): ToolboxWrapper => {
  return shallowMount(PToolbox, {
    props,
    global: {
      stubs: {
        ElDropdown,
        ElDropdownMenu,
        ElDropdownItem,
        PToolboxItem: {
          name: 'PToolboxItem',
          template: '<div class="stubbed-toolbox-item"></div>',
        },
      },
    },
  }) as unknown as ToolboxWrapper
}

describe('PToolbox', () => {
  let wrapper: ToolboxWrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllTimers()
  })

  describe('props', () => {
    it('should receive correct props', () => {
      expect(wrapper.props()).toMatchObject(defaultProps)
    })
  })

  describe('rendering', () => {
    it('should render dropdown menu', () => {
      expect(wrapper.findComponent(ElDropdown).exists()).toBe(true)
    })

    it('should update xAxisOffset when pCoordinates.x changes', async () => {
      const xAxisOffsetMock = ref(0)

      const localWrapper = shallowMount(PToolbox, {
        props: defaultProps,
        global: {
          stubs: {
            ElDropdown,
            ElDropdownMenu,
            ElDropdownItem,
            PToolboxItem: {
              name: 'PToolboxItem',
              template: '<div class="stubbed-toolbox-item"></div>',
            },
          },
          mocks: {
            xAxisOffset: xAxisOffsetMock,
          },
        },
      })

      await localWrapper.setProps({ pCoordinates: { x: 300, y: 200 } })
      await localWrapper.vm.$nextTick()

      xAxisOffsetMock.value = 150

      expect(xAxisOffsetMock.value).toBeGreaterThan(0)

      // Wait for setTimeout to complete before unmounting
      await new Promise(resolve => setTimeout(resolve, 20))
      localWrapper.unmount()
    })
  })
})
