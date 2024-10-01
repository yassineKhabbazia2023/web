/* eslint-disable vitest/no-hooks */
import TreeNode from '@ged/modules/Treeview/components/TreeNode'
import TreeNodeActions from '@ged/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeProps }
  from '@ged/modules/Treeview/components/TreeNode/TreeNodeTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Folder, FolderProperties } from '@ged/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import {
  PICalculatorEuro,
  PIFolder,
  PIInbox,
  PIKpmg,
  PIPersonVcard,
  PITrash,
  PTooltip,
} from '@pulse/styleguide'

const fold: Folder = {
  id: 1,
  children: [
    {
      id: 2,
      children: [{} as Folder],
      name: 'TheFolder',
      parent: { id: 1 },
      permissions: [],
      properties: {} as FolderProperties,
      serviceId: 'some-service',
    } as Folder,
  ],
  name: 'A',
  parent: { id: 0 },
  permissions: [],
  properties: {} as FolderProperties,
  serviceId: 'some-service',
} as Folder

type TreeNodeSetup = {
  iconsMapping: string
  isHovered: boolean
  isOpen: boolean
}

const defaultProps: TreeNodeProps = {
  node: 'string',
  data: fold,
  serviceId: 'string',
  entityId: 'string',
  selectedFolder: {} as Folder,
}

export type TreeNodeWrapper = VueWrapper<
  ComponentPublicInstance<TreeNodeProps, TreeNodeSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: TreeNodeProps = defaultProps,
): TreeNodeWrapper => {
  return mount(TreeNode, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as TreeNodeWrapper
}

describe('props', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('should map the correct icon based on iconName prop', () => {
    const iconMappingCases = [
      {
        folderIconName: 'accountingRoot',
        expectedIcon: PICalculatorEuro,
      },
      {
        folderIconName: 'socialRoot',
        expectedIcon: PIPersonVcard,
      },
      {
        folderIconName: 'deposit',
        expectedIcon: PIInbox,
      },
      {
        folderIconName: 'reservedKpmg',
        expectedIcon: PIKpmg,
      },
      {
        folderIconName: 'binIcon',
        expectedIcon: PITrash,
      },
      {
        folderIconName: 'someThing',
        expectedIcon: PIFolder,
      },
    ]
    it.each(iconMappingCases)(
      'validate icons mapping with "%s"',
      ({ folderIconName, expectedIcon }) => {
        const folder = { ...fold, iconName: folderIconName }

        const updatedProps = { ...defaultProps, data: folder }

        const wrapper = createWrapper(updatedProps)

        const componentInstance = wrapper.vm
        expect(componentInstance.iconsMapping).toStrictEqual(expectedIcon)
      },
    )
  })
  it('should not display PIcon when folder has children', async () => {
    const wrapper = createWrapper()

    await nextTick()

    const treeNode = await wrapper.find('.tree-node')

    expect(treeNode.classes('tree-node--no-children')).toBeFalsy()

    await nextTick()

    expect(treeNode.find('.tree-node__no-child-icon').exists()).toBeFalsy()
  })

  it('should display PIcon when folder has no children', async () => {
    const props: TreeNodeProps = {
      ...defaultProps,
      data: {
        id: 1,
        children: [],
        name: 'A',
        parent: { id: 0 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      } as Folder,
    }

    const wrapper = createWrapper(props)

    await nextTick()

    const treeNode = wrapper.find('.tree-node')

    expect(treeNode.classes('tree-node--no-children')).toBeTruthy()

    await nextTick()

    const dotIcon = treeNode.find('.tree-node__no-child-icon')

    expect(dotIcon.exists()).toBeTruthy()
  })

  it('should activate tooltip when folder name is too long', async () => {
    const props: TreeNodeProps = {
      ...defaultProps,
      data: {
        id: 1,
        children: [],
        name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        parent: { id: 0 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      } as Folder,
    }

    const wrapper = createWrapper(props)

    await nextTick()

    const tooltip = wrapper.findComponent(PTooltip)

    await nextTick()

    expect(tooltip.props('disabled')).toBeFalsy()
    expect(tooltip.props('pContent')).toBe(props.data.name)

    await nextTick()

    const actions = wrapper.findComponent(
      TreeNodeActions,
    )

    expect(actions.props('selectedOrHovered')).toBeFalsy()
  })

  it('should disabled tooltip when folder name is short', async () => {
    const wrapper = createWrapper()

    await nextTick()

    const tooltip = wrapper.findComponent(PTooltip)

    await nextTick()

    expect(tooltip.props('disabled')).toBeTruthy()
  })
})

describe('interactions', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  it('should set isOpen when div emit click', async () => {
    const wrapper = createWrapper()

    await nextTick()

    const treeNode = wrapper.find('.tree-node')

    const actions = wrapper.findComponent(TreeNodeActions)

    await nextTick()

    await treeNode.trigger('click')
    await nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()
  })

  it('should set isHovered when div emit mouseover', async () => {
    const wrapper = createWrapper()

    await nextTick()

    const treeNode = wrapper.find('.tree-node')

    const actions = wrapper.findComponent(TreeNodeActions)

    await nextTick()

    await treeNode.trigger('mouseover')
    await nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()
  })

  it('should set isHovered when div emit mouseleave', async () => {
    const wrapper = createWrapper()

    await nextTick()

    const treeNode = wrapper.find('.tree-node')

    const actions = wrapper.findComponent(TreeNodeActions)

    await nextTick()

    await treeNode.trigger('mouseover')
    await nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()

    await nextTick()

    await treeNode.trigger('mouseleave')
    await nextTick()

    expect(actions.props('selectedOrHovered')).toBeFalsy()
  })

  it('should emit p-toolbox-item-clicked when p-toolbox-item-clicked is emitted', async () => {
    const wrapper = createWrapper()

    const actions = wrapper.findComponent(TreeNodeActions)

    await nextTick()

    await actions.vm.$emit('p-toolbox-item-clicked', 'test')
    await nextTick()

    expect(wrapper.emitted('p-toolbox-item-clicked')).toStrictEqual([['test', fold]])
  })

  it('should selectedOrHovered when p-toolbox-dropdown-visibility-change is emitted', async () => {
    const folder = { ...fold, permissions: ['CAN_DELETE_FOLDER'] }
    const updatedProps = { ...defaultProps, data: folder }

    const wrapper = createWrapper(updatedProps)

    const actions = wrapper.findComponent(TreeNodeActions)

    await nextTick()

    await actions.vm.$emit('p-toolbox-dropdown-visibility-change', false)
    await nextTick()

    expect(actions.props('selectedOrHovered')).toBeFalsy()
  })

  // eslint-disable-next-line max-len
  it('should selectedOrHovered when p-toolbox-dropdown-visibility-change is emitted from TreeNodeActionsToolbox', async () => {
    const folder = { ...fold, permissions: ['CAN_DELETE_FOLDER'] }
    const updatedProps = { ...defaultProps, data: folder }

    const wrapper = createWrapper(updatedProps)

    const actions = wrapper.findComponent({ name: 'TreeNodeActionsToolbox' })

    await nextTick()

    await actions.vm.$emit('p-toolbox-dropdown-visibility-change', false)
    await nextTick()
    const treeNodeActionsWrapper = wrapper.findComponent(TreeNodeActions)
    expect(treeNodeActionsWrapper.props('selectedOrHovered')).toBeFalsy()
  })

  describe('drag and drop scope', () => {
    let wrapper: TreeNodeWrapper

    beforeEach(() => {
      vi.useFakeTimers()
      wrapper = createWrapper()
    })

    it('should emit documents-dropped-on-tree-node with the correct payload upon drop event', async () => {
      const DOCUMENT_TO_MOVE = 'a custom document'
      expect(wrapper.emitted('documents-dropped-on-tree-node')).toBeFalsy()

      await wrapper.trigger('drop', { dataTransfer: { getData: () => JSON.stringify(DOCUMENT_TO_MOVE) } })

      expect(wrapper.emitted('documents-dropped-on-tree-node')).toStrictEqual([[DOCUMENT_TO_MOVE, defaultProps.data]])
    })

    it('should emit expand-or-collapse-node with the correct payload upon dragOver event', async () => {
      expect(wrapper.emitted('expand-or-collapse-node')).toBeFalsy()

      await wrapper.trigger('dragover', { dataTransfer: { types: [fold.serviceId] } })
      vi.runAllTimers()

      expect(wrapper.emitted('expand-or-collapse-node')).toStrictEqual([[fold.id]])
    })
  })
})
