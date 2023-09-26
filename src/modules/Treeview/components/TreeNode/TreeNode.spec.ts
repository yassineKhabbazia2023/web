/* eslint-disable vitest/no-hooks */
import TreeNode from '@/modules/Treeview/components/TreeNode'
import TreeNodeActions from '@/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeProps }
  from '@/modules/Treeview/components/TreeNode/TreeNodeTypes'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import {
  dynamicUntilFound,
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { ComponentPublicInstance } from 'vue'
// import {
//   PTooltip
// } from '@kpmg/styleguide'
import {
  PICalculatorEuro,
  PIFolder,
  PIInbox,
  PIKpmg,
  PIPersonVcard,
  PITrash
} from '@kpmg/styleguide'

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
      serviceId: 'some-service'
    } as Folder
  ],
  name: 'A',
  parent: { id: 0 },
  permissions: [],
  properties: {} as FolderProperties,
  serviceId: 'some-service'
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
  selectedFolder: {} as Folder
}

export type TreeNodeWrapper = VueWrapper<
  ComponentPublicInstance<TreeNodeProps, TreeNodeSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: TreeNodeProps = defaultProps
): TreeNodeWrapper => {
  return mount(TreeNode, {
    props,
    global: {
      plugins: [pinia]
    }
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
        expectedIcon: PICalculatorEuro
      },
      {
        folderIconName: 'socialRoot',
        expectedIcon: PIPersonVcard
      },
      {
        folderIconName: 'deposit',
        expectedIcon: PIInbox
      },
      {
        folderIconName: 'reservedKpmg',
        expectedIcon: PIKpmg
      },
      {
        folderIconName: 'binIcon',
        expectedIcon: PITrash
      },
      {
        folderIconName: 'someThing',
        expectedIcon: PIFolder
      }
    ]
    it.each(iconMappingCases)(
      'validate icons mapping with "%s"',
      ({ folderIconName, expectedIcon }) => {
        const folder = { ...fold, iconName: folderIconName }

        const updatedProps = { ...defaultProps, data: folder }

        const wrapper = createWrapper(updatedProps)

        const componentInstance = wrapper.vm
        expect(componentInstance.iconsMapping).toEqual(expectedIcon)
      }
    )
  })
  it('should not display PIcon when folder has children', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()

    const treeNode = await dynamicUntilFound(wrapper, '.tree-node')

    expect(treeNode.classes('tree-node--no-children')).toBeFalsy()

    await wrapper.vm.$nextTick()

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
        serviceId: 'some-service'
      } as Folder
    }

    const wrapper = createWrapper(props)

    await wrapper.vm.$nextTick()

    const treeNode = await dynamicUntilFound(wrapper, '.tree-node')

    expect(treeNode.classes('tree-node--no-children')).toBeTruthy()

    await wrapper.vm.$nextTick()

    const dotIcon = await dynamicUntilFound(
      treeNode,
      '.tree-node__no-child-icon'
    )
    expect(dotIcon.exists()).toBeTruthy()
  })
  // PTooltip props from styleguide cause issue with unit tests

  //   it('should activate tooltip when folder name is too long', async () => {
  //     const props: TreeNodeProps = {
  //       ...defaultProps,
  //       data: {
  //         id: 1,
  //         children: [],
  //         name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  //         parent: { id: 0 },
  //         permissions: [],
  //         properties: {} as FolderProperties,
  //         serviceId: 'some-service'
  //       } as Folder
  //     }

  //     const wrapper = createWrapper(props)

  //     await wrapper.vm.$nextTick()

  //     const tooltip = await dynamicUntilFoundComponent(wrapper, PTooltip)

  //     await wrapper.vm.$nextTick()

  //     expect(tooltip.props('disabled')).toBeFalsy()
  //     expect(tooltip.props('content')).toBe(props.data.name)

  //     await wrapper.vm.$nextTick()

  //     const actions = await dynamicUntilFoundComponent(
  //       wrapper,
  //       TreeNodeActions
  //     )

  //     expect(actions.props('permissions')).toBe(props.data.permissions)
  //     expect(actions.props('selectedOrHovered')).toBeFalsy()
  //   })

  //   it('should disabled tooltip when folder name is short', async () => {
  //     const wrapper = createWrapper()

  //     await wrapper.vm.$nextTick()

  //     const tooltip = await dynamicUntilFoundComponent(wrapper, PTooltip)

  //     await wrapper.vm.$nextTick()

//     expect(tooltip.props('disabled')).toBeTruthy()
//   })
})

describe('interactions', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  it('should set isOpen when div emit click', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()

    const treeNode = await dynamicUntilFound(wrapper, '.tree-node')

    const actions = await dynamicUntilFoundComponent(wrapper, TreeNodeActions)

    await wrapper.vm.$nextTick()

    await treeNode.trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()
  })

  it('should set isHovered when div emit mouseover', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()

    const treeNode = await dynamicUntilFound(wrapper, '.tree-node')

    const actions = await dynamicUntilFoundComponent(wrapper, TreeNodeActions)

    await wrapper.vm.$nextTick()

    await treeNode.trigger('mouseover')
    await wrapper.vm.$nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()
  })

  it('should set isHovered when div emit mouseleave', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()

    const treeNode = await dynamicUntilFound(wrapper, '.tree-node')

    const actions = await dynamicUntilFoundComponent(wrapper, TreeNodeActions)

    await wrapper.vm.$nextTick()

    await treeNode.trigger('mouseover')
    await wrapper.vm.$nextTick()

    expect(actions.props('selectedOrHovered')).toBeTruthy()

    await wrapper.vm.$nextTick()

    await treeNode.trigger('mouseleave')
    await wrapper.vm.$nextTick()

    expect(actions.props('selectedOrHovered')).toBeFalsy()
  })

  it('should emit on-toolbox-item-clicked when p-toolbox-item-clicked is emitted', async () => {
    const wrapper = createWrapper()

    const actions = await dynamicUntilFoundComponent(wrapper, TreeNodeActions)

    await wrapper.vm.$nextTick()

    await actions.vm.$emit('p-toolbox-item-clicked', 'test')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-toolbox-item-clicked')).toStrictEqual([['test', fold]])
  })

  it('should selectedOrHovered when on-toolbox-dropdown-close is emitted', async () => {
    const folder = { ...fold, permissions: ['CAN_DELETE_FOLDER'] }
    const updatedProps = { ...defaultProps, data: folder }

    const wrapper = createWrapper(updatedProps)

    const actions = await dynamicUntilFoundComponent(wrapper, TreeNodeActions)

    await wrapper.vm.$nextTick()

    await actions.vm.$emit('on-toolbox-dropdown-close', false)
    await wrapper.vm.$nextTick()

    expect(actions.props('selectedOrHovered')).toBeFalsy()
  })

})
