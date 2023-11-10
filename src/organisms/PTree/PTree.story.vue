<template>
  <Story title="4. Organisms/Tree" icon="carbon:tree">
    <Variant title="Basic usage">
      <PTree
        :data="dataSource"
        :dataKeys="dataKeys"
        @p-tree-node-clicked="handlePTreeNodeClicked"
      />
    </Variant>

    <Variant title="With custom nodes">
      <PTree
        :data="dataSource"
        :dataKeys="dataKeys"
        hasCustomNodes
        @p-tree-node-clicked="handlePTreeNodeClicked"
      >
        <!-- eslint-disable vue/no-unused-vars -->
        <template #default="{ node, data }">
          <span>{{ node.label }}</span>
          <PToolbox :elements="toolboxItems">
            <PButton
              pCircle
              style="padding: 4px; height: 24px; margin-left: 16px"
            >
              <PIcon>
                <PIThreeDots />
              </PIcon>
            </PButton>
          </PToolbox>
        </template>
        <!-- eslint-enable vue/no-unused-vars -->
      </PTree>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PTree from './'
import PButton from '@/atoms/PButton'
import PToolbox from '@/molecules/PToolbox'
import { logEvent } from 'histoire/client'

const toolboxItems = [
  {
    iconName: 'PITrash',
    value: 'Delete',
    actionName: 'delete'
  },
  {
    iconName: 'PIAdd',
    value: 'Add',
    actionName: 'add'
  },
  {
    iconName: 'PIVectorPen',
    value: 'Rename',
    actionName: 'rename'
  },
  {
    iconName: 'PISend',
    value: 'Transmit',
    actionName: 'transmit'
  }
]
export interface Tree {
  label: string
  children?: Tree[]
  customData?: string
}

const handlePTreeNodeClicked = (node: any) => {
  logEvent('click', node)
}
const dataKeys = {
  label: 'label',
  children: 'children'
}

const dataSource: Tree[] = [
  {
    label: 'Level one 1',
    customData: 'Something',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]
</script>

<docs lang="md">
## Tree

You can either use the raw component, or use custom node to render (nearly) anything you want.
<div class="responsive-iframe-container">
<iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D3408%253A10383%26mode%3Ddev"></iframe>
</div>
</docs>
