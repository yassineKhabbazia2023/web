<template>
  <Story title="2. Atoms/ToolboxItem" icon="radix-icons:divider-horizontal">
    <Variant title="Default">
      <PToolboxItem
        :pValue="defaultState.pValue"
        :pIconName="defaultState.pIconName"
        :pState="defaultState.pState"
        :disabled="defaultState.disabled"
      />
      <template #controls>
        <HstText v-model="defaultState.pValue" title="Value" />
        <HstCheckbox v-model="defaultState.disabled" title="disabled" />
      </template>
    </Variant>

    <Variant title="Danger with pIconName as Component">
      <PToolboxItem
        :pValue="dangerState.pValue"
        :pIconName="dangerState.pIconName"
        :pState="dangerState.pState"
        :disabled="dangerState.disabled"
      />
      <template #controls>
        <HstText v-model="defaultState.pValue" title="Value" />
        <HstCheckbox v-model="defaultState.disabled" title="disabled" />
      </template>
    </Variant>

    <Variant title="Without icon">
      <PToolboxItem
        :pValue="WithoutIconState.pValue"
        :pIconName="WithoutIconState.pIconName"
        :disabled="WithoutIconState.disabled"
      />
      <template #controls>
        <HstText v-model="WithoutIconState.pValue" title="Value" />
        <HstCheckbox v-model="WithoutIconState.disabled" title="disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PToolboxItem from '../../atoms/PToolboxItem'
import type { PToolboxItemProps } from './PToolboxItemTypes'
import { PIAdd } from '../../atoms/PIcon/components'

const defaultState: PToolboxItemProps = reactive({
  pValue: 'Supprimer',
  pIconName: 'PITrash',
  pActionName: 'delete',
  disabled: false,
  pState: 'default',
})

const dangerState: PToolboxItemProps = reactive({
  pValue: 'Supprimer',
  pIconName: PIAdd,
  pActionName: 'delete',
  disabled: false,
  pState: 'danger',
})

const WithoutIconState = reactive({
  pActionName: 'add',
  pValue: 'Hello world',
  disabled: false,
  pIconName: '',
})
</script>
<docs lang="md">
  <div>
    PToolboxItem is used to construct each line of the PToolbox element.
    It can contains an icon or not.
  </div>

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1277%253A6366%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
