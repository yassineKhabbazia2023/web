/* eslint-disable vitest/no-hooks */
import TreeNodeActions from '@ged/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeActionsProps }
  from '@ged/modules/Treeview/components/TreeNodeActions/TreeNodeActionsTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { vi, describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import TreeNodeActionsToolbox from './TreeNodeActionsToolbox'

const defaultProps: TreeNodeActionsProps = {
  permissions: [],
  selectedOrHovered: true,
}

export type TreeNodeActionsWrapper = VueWrapper<
  ComponentPublicInstance<TreeNodeActionsProps>
>

const pinia = createPinia()
const createWrapper = (props: TreeNodeActionsProps = defaultProps): TreeNodeActionsWrapper => {
  return mount(TreeNodeActions, {
    props,
    global: {
      stubs: {
        PToolbox: {
          template: '<span />',
        },
      },
      plugins: [pinia],
    },
  })as unknown as TreeNodeActionsWrapper
}

describe('treeNodeActions', () => {
  describe('interactions', () => {
    it('should emit visible-change when p-toolbox-dropdown-visibility-change is emitted', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = wrapper.findComponent(TreeNodeActionsToolbox)

      await toolbox.vm.$emit('p-toolbox-dropdown-visibility-change', true)
      await nextTick()

      expect(wrapper.emitted('p-toolbox-dropdown-visibility-change')).toStrictEqual([
        [true],
      ])
    })

    it('should emit p-toolbox-dropdown-visibility-change when ' +
            'p-toolbox-dropdown-visibility-change is emitted', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = wrapper.findComponent(TreeNodeActionsToolbox)

      await toolbox.vm.$emit('p-toolbox-item-clicked', 'test')
      await nextTick()

      expect(wrapper.emitted('p-toolbox-item-clicked')).toStrictEqual([
        ['test'],
      ])
    })

    it('should expose function to close actions toolbox', async () => {
      // this is just triggering the function as it's just a function that is exposed
      // and doesn't do anything in the template directly. There's no specific output.
      // Testing on the vm just ensures that the function is actually exposed as expected with defineExpose
      const wrapper = createWrapper() as any
      // This mocks the template ref value
      const closeActionToolboxMock = {
        closePToolbox: vi.fn(),
      }
      wrapper.vm.actionToolboxRef = closeActionToolboxMock
      await wrapper.vm.closeActionToolbox()
      expect(closeActionToolboxMock.closePToolbox).toHaveBeenCalled()
    })
  })
})
