import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import type { TreeNodeActionsToolboxProps } from './TreeNodeActionsToolboxTypes'

import TreeNodeActionsToolbox from '.'

const defaultProps: TreeNodeActionsToolboxProps = {
  permissions: [],
  selectedOrHovered: true,
  triggerType: 'click',
  showSlotIfDataEmpty: false,
}

type TreeNodeActionsSetup = {
  hasActionButton: boolean
  toolboxBasicData: any
  isToolBoxVisible: boolean
}

export type TreeNodeActionsWrapper = VueWrapper<
  ComponentPublicInstance<TreeNodeActionsToolboxProps, TreeNodeActionsSetup>
>

const createWrapper = (props: TreeNodeActionsToolboxProps = defaultProps)
  : TreeNodeActionsWrapper => {
  return mount(TreeNodeActionsToolbox, {
    props,
    slots: {
      default: '<button class="custom-button">Custom Button Content</button>',
    },
  }) as unknown as TreeNodeActionsWrapper
}

describe('treeNodeActions', () => {
  describe('props', () => {
    it('should render PToolbox when permissions and selectedOrHovered', () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const componentInstance = wrapper.vm
      expect(componentInstance.isToolBoxVisible).toBeTruthy()
      expect(componentInstance.toolboxBasicData).toStrictEqual([
        {
          pIconName: 'download',
          pActionName: 'toolbox-download-action-click',
          pValue: 'Télécharger',
        },
        {
          pActionName: 'toolbox-delete-action-click',
          pIconName: 'trash',
          pValue: 'Supprimer',
        },
      ])
    })

    it('should not render PToolbox when permissions is empty', () => {
      const props: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: [],
      }

      const wrapper = createWrapper(props)
      const componentInstance = wrapper.vm

      expect(componentInstance.isToolBoxVisible).toBeFalsy()
    })

    it('should not render PToolbox when isVisible false', () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
        isVisible: false,
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const componentInstance = wrapper.vm
      expect(componentInstance.isToolBoxVisible).toBeFalsy()
    })

    describe('when permissions is not empty', () => {
      it('should permissions with upload folder by default', async () => {
        const props: TreeNodeActionsToolboxProps = {
          ...defaultProps,
          permissions: ['azert'],
        }
        const wrapper = createWrapper(props)
        await nextTick()
        const componentInstance = wrapper.vm as any

        expect(componentInstance.toolboxBasicData).toHaveLength(1)
        expect(componentInstance.isToolBoxVisible).toBeTruthy()
      })

      it('should not render PToolbox when selectedOrHovered is false', async () => {
        const props: TreeNodeActionsToolboxProps = {
          ...defaultProps,
          permissions: ['azert'],
          selectedOrHovered: false,
        }

        const wrapper = createWrapper(props)
        await nextTick()

        // check that the toolbox items are generated correctly
        const componentInstance = wrapper.vm
        expect(componentInstance.toolboxBasicData).toHaveLength(1)

        // check that the toolbox is hidden duo to selectedOrHovered is false
        expect(componentInstance.isToolBoxVisible).toBeFalsy()
      })
    })
  })

  describe('interactions', () => {
    it('should emit visible-change when p-toolbox-dropdown-visibility-change is emitted', async () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = wrapper.findComponent({ name: 'PToolbox' })

      await toolbox.vm.$emit('visible-change', true)
      await nextTick()

      expect(wrapper.emitted('p-toolbox-dropdown-visibility-change')).toStrictEqual([
        [true],
      ])
    })

    it('should emit visible-change when p-toolbox-dropdown-visibility-change is emitted (2)', async () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = wrapper.findComponent({ name: 'PToolbox' })

      await toolbox.vm.$emit('p-toolbox-item-clicked', 'test')
      await nextTick()

      expect(wrapper.emitted('p-toolbox-item-clicked')).toStrictEqual([
        ['test'],
      ])
    })
  })
})
