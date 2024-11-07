<template>
  <ElDropdown
    ref="dropdownRef"
    popperClass="p-toolbox shadow--3"
    :placement="pPlacement"
  >
    <slot />
    <template #dropdown>
      <ElDropdownMenu :data-testid="pElementsTestId">
        <ElDropdownItem
          v-for="({
            pValue, pIconName, pState, pActionName, disabled, pPlacementTooltip, pContentTooltip
          }, index) in pElements"
          :key="index"
        >
          <PToolboxItem
            :pValue="pValue"
            :pIconName="pIconName"
            :pState="pState"
            :disabled="disabled"
            :pPlacementTooltip="pPlacementTooltip"
            :pContentTooltip="pContentTooltip"
            @click="$emit('p-toolbox-item-clicked', pActionName)"
          />
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ref } from 'vue'
import PToolboxItem from '@/atoms/PToolboxItem'
import type { PToolboxProps } from './PToolboxTypes'

withDefaults(defineProps<PToolboxProps>(), {
  pElements: () => [],
  pPlacement: 'bottom-start',
})

defineEmits(['p-toolbox-item-clicked'])

const dropdownRef = ref()
</script>
