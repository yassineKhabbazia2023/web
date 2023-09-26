/* eslint-disable vitest/no-hooks */
import TreeNodeActions from '@/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeActionsProps }
  from '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsTypes'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ComponentPublicInstance } from 'vue'
import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { PToolbox } from '@kpmg/styleguide'

const defaultProps: TreeNodeActionsProps = {
  permissions: [],
  selectedOrHovered: true
}

type TreeNodeActionsSetup = {
  hasActionButton: boolean
  toolboxBasicData: any
  isToolBoxVisible: boolean
}

export type TreeNodeActionsWrapper = VueWrapper<
  ComponentPublicInstance<TreeNodeActionsProps, TreeNodeActionsSetup>
>

const pinia = createPinia()

const createWrapper = (props: TreeNodeActionsProps = defaultProps): TreeNodeActionsWrapper => {
  return mount(TreeNodeActions, {
    props,
    global: {
      plugins: [pinia]
    }
  })as unknown as TreeNodeActionsWrapper
}

// getBoundingClientRect is  a function that is being caused by the PToolbox component
// from the @kpmg/styleguide package.

//  This component uses the getBoundingClientRect() method to position itself on the page.
//  it needs to be mocked in the test env.
vi.mock('@kpmg/styleguide', () => {
  return {
    PToolbox: {
      getBoundingClientRect: () => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0
      })
    }
  }
})

describe('treeNodeActions', () => {
  describe('props', () => {
    beforeEach(() => {
      setActivePinia(pinia)
    })

    it('should render PToolbox when permissions and selectedOrHovered', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER']
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const componentInstance = wrapper.vm

      expect(componentInstance.isToolBoxVisible).toBeTruthy()
      expect(componentInstance.toolboxBasicData).toStrictEqual([
        {
          actionName: 'toolbox-delete-action-click',
          iconName: 'PITrash',
          value: 'Supprimer'
        }
      ])
    })

    it('should not render PToolbox when permissions is empty', async () => {
      const props: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: []
      }

      const wrapper = createWrapper(props)
      const componentInstance = wrapper.vm

      expect(componentInstance.isToolBoxVisible).toBeFalsy()
    })

    it('should not render PToolbox when permissions not in mapping', async () => {
      const props: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['azert']
      }

      const wrapper = createWrapper(props)

      const componentInstance = wrapper.vm
      expect(componentInstance.toolboxBasicData).toHaveLength(0)
      expect(componentInstance.isToolBoxVisible).toBeFalsy()

      it('should not render PToolbox when selectedOrHovered is false', async () => {
        const props: TreeNodeActionsProps = {
          ...defaultProps,
          selectedOrHovered: false
        }

        const wrapper = createWrapper(props)

        // check that the toolbox items are generated correctly
        const componentInstance = wrapper.vm
        expect(componentInstance.toolboxBasicData).toHaveLength(1)

        // check that the toolbox is hidden duo to selectedOrHovered is false
        expect(componentInstance.isToolBoxVisible).toBeFalsy()
      })
    })
  })

  describe('interactions', () => {
    it('should emit visible-change when on-toolbox-dropdown-close is emitted', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER']
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = await dynamicUntilFoundComponent(wrapper, PToolbox)

      await toolbox.vm.$emit('visible-change', true)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-toolbox-dropdown-close')).toStrictEqual([
        [true]
      ])
    })

    it('should emit visible-change when on-toolbox-dropdown-close is emitted', async () => {
      const updatedProps: TreeNodeActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER']
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = await dynamicUntilFoundComponent(wrapper, PToolbox)

      await toolbox.vm.$emit('p-toolbox-item-clicked', 'test')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-toolbox-item-clicked')).toStrictEqual([
        ['test']
      ])
    })
  })
})
