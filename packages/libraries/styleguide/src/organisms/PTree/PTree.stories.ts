import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTree from './PTree.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PToolbox from '../../molecules/PToolbox'
import type { PTreeProps } from './PTreeTypes'
import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'

const meta: Meta<typeof PTree> = {
  title: 'Organisms/PTree',
  component: PTree,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tree component that displays hierarchical data with support for custom nodes, expansion, and selection.',
      },
    },
  },
  argTypes: {
    pData: {
      control: 'object',
      description: 'Array of tree node data',
      table: {
        type: { summary: 'Array<any>' },
      },
    },
    pNodeKey: {
      control: 'text',
      description: 'Key property name for nodes',
      table: {
        type: { summary: 'string' },
      },
    },
    pDataKeys: {
      control: 'object',
      description: 'Mapping of data keys for label and children',
      table: {
        type: { summary: '{ label: string, children: string }' },
      },
    },
    pCurrentNodeKey: {
      control: 'text',
      description: 'Currently selected node key',
      table: {
        type: { summary: 'string | number' },
      },
    },
    pDefaultExpandedKeys: {
      control: 'object',
      description: 'Array of keys for nodes that should be expanded by default',
      table: {
        type: { summary: 'Array<string | number>' },
      },
    },
    pHasCustomNodes: {
      control: 'boolean',
      description: 'Whether to use custom node templates',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PTree>

interface Tree {
  id: number
  label: string
  children?: Tree[]
  customData?: string
}

const dataKeys = {
  label: 'label',
  children: 'children',
}

const dataSource: Tree[] = [
  {
    id: 1,
    label: 'Level one 1',
    customData: 'Something',
    children: [
      {
        id: 2,
        label: 'Level two 1-1',
        children: [
          {
            id: 3,
            label: 'Level three 1-1-1',
            children: [
              {
                id: 4,
                label: 'Level three 1-1-1-1',
              },
              {
                id: 41,
                label: 'Level three 1-1-2-1',
              },
              {
                id: 42,
                label: 'Level three 1-1-3-1',
              },
              {
                id: 43,
                label: 'Level three 1-1-4-1',
              },
            ],
          },
          {
            id: 31,
            label: 'Level three 1-1-2',
          },
          {
            id: 32,
            label: 'Level three 1-1-3',
          },
          {
            id: 33,
            label: 'Level three 1-1-4',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
        children: [
          {
            id: 6,
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        id: 7,
        label: 'Level two 2-2',
        children: [
          {
            id: 8,
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    id: 9,
    label: 'Level one 3',
    children: [
      {
        id: 10,
        label: 'Level two 3-1',
        children: [
          {
            id: 11,
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        id: 12,
        label: 'Level two 3-2',
        children: [
          {
            id: 13,
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const toolboxItems: PToolboxItemProps[] = [
  {
    pIconName: 'trash',
    pValue: 'Delete',
    pActionName: 'delete',
    pState: 'danger',
  },
  {
    pIconName: 'add',
    pValue: 'Add',
    pActionName: 'add',
    pState: 'default',
  },
  {
    pIconName: 'vectorPen',
    pValue: 'Rename',
    pActionName: 'rename',
    pState: 'default',
  },
  {
    pIconName: 'send',
    pValue: 'Transmit',
    pActionName: 'transmit',
    pState: 'default',
  },
]

export const BasicUsage: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree },
    setup() {
      const handlePTreeNodeClicked = (node: any) => {
        console.log('Tree node clicked:', node)
      }

      return {
        args,
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <h3>Basic Tree</h3>
        <PTree
          v-bind="args"
          @p-tree-node-clicked="handlePTreeNodeClicked"
        />
      </div>
    `,
  }),
  args: {
    pData: dataSource,
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pHasCustomNodes: false,
  },
}

export const WithCustomNodes: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree, PToolbox, PButton, PIcon },
    setup() {
      const handlePTreeNodeClicked = (node: any) => {
        console.log('Custom tree node clicked:', node)
      }

      return {
        args,
        toolboxItems,
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 500px;">
        <h3>Tree with Custom Nodes</h3>
        <PTree
          v-bind="args"
          @p-tree-node-clicked="handlePTreeNodeClicked"
        >
          <!-- eslint-disable vue/no-unused-vars -->
          <template #default="{ node, data }">
            <div class="p-tree__custom-node padding-right--2" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <span class="p-tree__custom-node__label" style="flex: 1 1 auto; width: 1px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                {{ node.label }}
              </span>
              <PToolbox :pElements="toolboxItems">
                <PButton
                  class="p-button--tree"
                  pCircle
                  pType="white"
                  pSize="small"
                >
                  <PIcon pName="threeDots" />
                </PButton>
              </PToolbox>
            </div>
          </template>
          <!-- eslint-enable vue/no-unused-vars -->
        </PTree>
      </div>
    `,
  }),
  args: {
    pData: dataSource,
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pHasCustomNodes: true,
  },
}

export const WithDefaultExpanded: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree },
    setup() {
      const handlePTreeNodeClicked = (node: any) => {
        console.log('Tree node clicked:', node)
      }

      return {
        args,
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <h3>Tree with Default Expanded Nodes</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          The first level nodes are expanded by default
        </p>
        <PTree
          v-bind="args"
          @p-tree-node-clicked="handlePTreeNodeClicked"
        />
      </div>
    `,
  }),
  args: {
    pData: dataSource,
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pDefaultExpandedKeys: [1, 4, 9],
    pHasCustomNodes: false,
  },
}

export const WithSelectedNode: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree },
    setup() {
      const handlePTreeNodeClicked = (node: any) => {
        console.log('Tree node clicked:', node)
      }

      return {
        args,
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <h3>Tree with Selected Node</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          Node "Level two 1-1" is currently selected
        </p>
        <PTree
          v-bind="args"
          @p-tree-node-clicked="handlePTreeNodeClicked"
        />
      </div>
    `,
  }),
  args: {
    pData: dataSource,
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pCurrentNodeKey: 2,
    pDefaultExpandedKeys: [1],
    pHasCustomNodes: false,
  },
}

export const FileSystemTree: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree, PIcon },
    setup() {
      const fileSystemData = [
        {
          id: 'root',
          label: 'Project Root',
          type: 'folder',
          children: [
            {
              id: 'src',
              label: 'src',
              type: 'folder',
              children: [
                {
                  id: 'components',
                  label: 'components',
                  type: 'folder',
                  children: [
                    { id: 'button.vue', label: 'Button.vue', type: 'file' },
                    { id: 'input.vue', label: 'Input.vue', type: 'file' },
                  ],
                },
                { id: 'main.ts', label: 'main.ts', type: 'file' },
                { id: 'app.vue', label: 'App.vue', type: 'file' },
              ],
            },
            {
              id: 'public',
              label: 'public',
              type: 'folder',
              children: [
                { id: 'index.html', label: 'index.html', type: 'file' },
                { id: 'favicon.ico', label: 'favicon.ico', type: 'file' },
              ],
            },
            { id: 'package.json', label: 'package.json', type: 'file' },
            { id: 'README.md', label: 'README.md', type: 'file' },
          ],
        },
      ]

      const handlePTreeNodeClicked = (node: any) => {
        console.log('File/folder clicked:', node)
      }

      return {
        args: {
          ...args,
          pData: fileSystemData,
        },
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <h3>File System Tree</h3>
        <PTree
          v-bind="args"
          pHasCustomNodes
          @p-tree-node-clicked="handlePTreeNodeClicked"
        >
          <template #default="{ node, data }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <PIcon 
                :pName="data.type === 'folder' ? 'folder' : 'fileText'" 
                :style="{ color: data.type === 'folder' ? '#f39c12' : '#3498db' }"
              />
              <span>{{ node.label }}</span>
            </div>
          </template>
        </PTree>
      </div>
    `,
  }),
  args: {
    pData: [],
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pDefaultExpandedKeys: ['root', 'src'],
    pHasCustomNodes: true,
  },
}

export const LongLabelsTree: Story = {
  render: (args: PTreeProps) => ({
    components: { PTree },
    setup() {
      const longLabelData = [
        {
          id: 1,
          label: 'This is a very long label that demonstrates how the tree component handles text overflow and wrapping when the content is too wide for the container',
          children: [
            {
              id: 2,
              label: 'Another extremely long label that should be truncated or wrapped depending on the tree component implementation and styling',
              children: [
                {
                  id: 3,
                  label: 'Short label',
                },
                {
                  id: 4,
                  label: 'Medium length label for comparison purposes',
                },
              ],
            },
          ],
        },
        {
          id: 5,
          label: 'Normal length label',
          children: [
            {
              id: 6,
              label: 'Yet another very long label that tests the component behavior with extensive text content that exceeds normal display width',
            },
          ],
        },
      ]

      const handlePTreeNodeClicked = (node: any) => {
        console.log('Long label node clicked:', node)
      }

      return {
        args: {
          ...args,
          pData: longLabelData,
        },
        handlePTreeNodeClicked,
      }
    },
    template: `
      <div style="padding: 20px; width: 350px;">
        <h3>Tree with Long Labels</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
          This demonstrates how the tree handles long text content
        </p>
        <PTree
          v-bind="args"
          @p-tree-node-clicked="handlePTreeNodeClicked"
        />
      </div>
    `,
  }),
  args: {
    pData: [],
    pDataKeys: dataKeys,
    pNodeKey: 'id',
    pDefaultExpandedKeys: [1, 5],
    pHasCustomNodes: false,
  },
}
