<template>
  <ElDropdown
    popperClass="p-toolbox shadow--3"
    placement="bottom-start"
  >
    <slot />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="({pValue, pIconName, pState, pActionName, disabled}, index) in pElements"
          :key="index"
        >
          <PToolboxItem
            :pValue="pValue"
            :pIconName="pIconName"
            :pState="pState"
            :disabled="disabled"
            :pActionName="pActionName"
            @click="$emit('p-toolbox-item-clicked', pActionName)"
          />
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import PToolboxItem from '@/atoms/PToolboxItem'
import type { PToolboxProps } from './PToolboxTypes'

withDefaults(defineProps<PToolboxProps>(), {
  pElements: () => []
})

defineEmits(['p-toolbox-item-clicked'])
</script>
