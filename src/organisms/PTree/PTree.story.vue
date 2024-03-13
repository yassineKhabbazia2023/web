<template>
  <Story title="4. Organisms/Tree" icon="carbon:tree">
    <Variant title="Basic usage">
      <PTree
        :pData="dataSource"
        :pDataKeys="dataKeys"
        pNodeKey="id"
        @p-tree-node-clicked="handlePTreeNodeClicked"
      />
    </Variant>

    <Variant title="With custom nodes">
      <PTree
        :pData="dataSource"
        :pDataKeys="dataKeys"
        pHasCustomNodes
        pNodeKey="id"
        @p-tree-node-clicked="handlePTreeNodeClicked"
      >
        <!-- eslint-disable vue/no-unused-vars -->
        <template #default="{ node, data }">
          <div class="p-tree__custom-node padding-right--2">
            <span>{{ node.label }}</span>
            <PToolbox :pElements="toolboxItems">
              <PButton
                class="p-button--tree"
                pCircle
                pType="white"
                pSize="small"
              >
                <PIcon>
                  <PIThreeDots />
                </PIcon>
              </PButton>
            </PToolbox>
          </div>
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
import type { PToolboxItemProps } from '@/atoms/PToolboxItem/PToolboxItemTypes'
import { logEvent } from 'histoire/client'

const toolboxItems: PToolboxItemProps[] = [
  {
    pIconName: 'PITrash',
    pValue: 'Delete',
    pActionName: 'delete',
    pState: 'danger',
  },
  {
    pIconName: 'PIAdd',
    pValue: 'Add',
    pActionName: 'add',
    pState: 'default',
  },
  {
    pIconName: 'PIVectorPen',
    pValue: 'Rename',
    pActionName: 'rename',
    pState: 'default',
  },
  {
    pIconName: 'PISend',
    pValue: 'Transmit',
    pActionName: 'transmit',
    pState: 'default',
  },
]
export interface Tree {
  id: number
  label: string
  children?: Tree[]
  customData?: string
}

const handlePTreeNodeClicked = (node: any) => {
  logEvent('click', node)
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
</script>

<style>
  .p-tree__custom-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>

<docs lang="md">
## Tree

You can either use the raw component, or use custom node to render (nearly) anything you want.
<div class="responsive-iframe-container">
<iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D3408%253A10383%26mode%3Ddev"></iframe>
</div>
</docs>
