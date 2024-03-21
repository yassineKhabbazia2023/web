/* eslint-disable vitest/no-hooks */
import TreeNodeActions from '@/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeActionsProps }
  from '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
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
    it('should emit visible-change when p-toolbox-dropdown-close is emitted', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = wrapper.findComponent(TreeNodeActionsToolbox)

      await toolbox.vm.$emit('p-toolbox-dropdown-close', true)
      await nextTick()

      expect(wrapper.emitted('p-toolbox-dropdown-close')).toStrictEqual([
        [true],
      ])
    })

    it('should emit p-toolbox-dropdown-close when ' +
            'p-toolbox-dropdown-close is emitted', async () => {
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
  })
})
