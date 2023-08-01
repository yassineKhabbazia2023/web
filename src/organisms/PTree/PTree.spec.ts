import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PTree from '@/organisms/PTree'
import type { PTreeProps } from './PTreeTypes'

const treeData = [
  {
    label: 'Level one 1',
    customData: 'Something',
    children: [
      {
        label: 'Level two 1-1',
        customData: 'Something',
        children: [
          {
            label: 'Level three 1-1-1',
            customData: 'Something'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    customData: 'Something',
    children: [
      {
        label: 'Level two 2-1',
        customData: 'Something'
      }
    ]
  }
]

const customNodeSlot = `
  <template #default="{ node, data }">
    <div class="p-custom-tree-node">
      <span>custom node label {{ node.label }}</span>
      <span>custom node label {{ data.customData }}</span>
    </div>
  </template>
  `
const baseProps: PTreeProps = {
  data: treeData,
  dataKeys: { label: 'label', children: 'children' },
  hasCustomNodes: false
}
const createWrapper = mount(PTree, {
  props: baseProps
})

const createWrapperWithScopedSlot = mount(PTree, {
  props: {
    ...baseProps,
    hasCustomNodes: true
  },
  slots: {
    default: customNodeSlot
  }
})
describe('pTree', () => {
  describe('props', () => {
    it('renders component without custom nodes', () => {
      const wrapper = createWrapper
      expect(wrapper.exists()).toBeTruthy()
    })

    it('renders component with custom nodes when hasCustomNodes is true', () => {
      const wrapper = createWrapperWithScopedSlot

      const customTreeNodes = wrapper.findAll('.p-custom-tree-node')
      const expectedNodesLength = treeData.length
      expect(customTreeNodes.length).toHaveLength(expectedNodesLength)
    })
  })

  describe('intercations', () => {
    it('should receive appropriate payload when node is clicked', async () => {
      const wrapper = createWrapperWithScopedSlot
      const firstCustomTreeNode = wrapper.find('.p-custom-tree-node')
      await firstCustomTreeNode.trigger('click')
      expect(wrapper.emitted()).toHaveProperty('p-tree-node-clicked')
    })
  })
})
