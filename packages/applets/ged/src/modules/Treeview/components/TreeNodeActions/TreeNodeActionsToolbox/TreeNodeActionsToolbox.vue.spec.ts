import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { TreeNodeActionsToolboxProps } from './TreeNodeActionsToolboxTypes'

import TreeNodeActionsToolbox from '.'

const defaultProps: TreeNodeActionsToolboxProps = {
  permissions: [],
  selectedOrHovered: true,
  triggerType: 'click',
  showSlotIfDataEmpty: false,
}

const createWrapper = (props: TreeNodeActionsToolboxProps = defaultProps)
: VueWrapper => {
  return mount(TreeNodeActionsToolbox, {
    props,
    slots: {
      default: '<button class="custom-button">Custom Button Content</button>',
    },
  })
}

const findToolbox = (wrapper: VueWrapper) => wrapper.findComponent({ name: 'PToolbox' })

describe('treeNodeActions', () => {
  describe('props', () => {
    it('should render PToolbox when permissions and selectedOrHovered', () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const toolbox = findToolbox(wrapper)
      expect(toolbox.exists()).toBeTruthy()
      expect(toolbox.props('pElements')).toStrictEqual([
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

      expect(findToolbox(wrapper).exists()).toBeFalsy()
    })

    it('should not render PToolbox when isVisible false', () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
        isVisible: false,
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      expect(findToolbox(wrapper).exists()).toBeFalsy()
    })

    describe('when permissions is not empty', () => {
      it('should only pass the default download action for an unknown permission', async () => {
        const props: TreeNodeActionsToolboxProps = {
          ...defaultProps,
          permissions: ['azert'],
        }
        const wrapper = createWrapper(props)
        await nextTick()

        const toolbox = findToolbox(wrapper)
        expect(toolbox.exists()).toBeTruthy()
        expect(toolbox.props('pElements')).toHaveLength(1)
      })

      it('should not render PToolbox when selectedOrHovered is false', async () => {
        const props: TreeNodeActionsToolboxProps = {
          ...defaultProps,
          permissions: ['azert'],
          selectedOrHovered: false,
        }

        const wrapper = createWrapper(props)
        await nextTick()

        // the toolbox is hidden because selectedOrHovered is false
        expect(findToolbox(wrapper).exists()).toBeFalsy()
      })
    })
  })

  describe('interactions', () => {
    it('should emit p-toolbox-dropdown-visibility-change when PToolbox emits visible-change', async () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = findToolbox(wrapper)

      await toolbox.vm.$emit('visible-change', true)
      await nextTick()

      expect(wrapper.emitted('p-toolbox-dropdown-visibility-change')).toStrictEqual([
        [true],
      ])
    })

    it('should re-emit p-toolbox-item-clicked when PToolbox emits p-toolbox-item-clicked', async () => {
      const updatedProps: TreeNodeActionsToolboxProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_FOLDER'],
      }

      const wrapper = createWrapper(updatedProps)

      const toolbox = findToolbox(wrapper)

      await toolbox.vm.$emit('p-toolbox-item-clicked', 'test')
      await nextTick()

      expect(wrapper.emitted('p-toolbox-item-clicked')).toStrictEqual([
        ['test'],
      ])
    })
  })
})
