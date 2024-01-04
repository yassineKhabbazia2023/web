<template>
  <ElTabs
    v-model="selectedTabName"
    :type="pType"
    :closable="pClosable"
    :addable="pAddable"
    :editable="pEditable"
    :tabPosition="pTabPosition"
    :stretch="pStretch"
    :beforeLeave="pBeforeLeave"
  >
    <slot />
  </ElTabs>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElTabs } from 'element-plus'
import type { PTabsProps } from './PTabsTypes'

const props = withDefaults(defineProps<PTabsProps>(), {
  pType: '',
  pClosable: false,
  pAddable: false,
  pEditable: false,
  pTabPosition: 'top',
  pStretch: false,
  pBeforeLeave: undefined
})
const emit = defineEmits(['update:modelValue'])

const selectedTabName = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue)
})
</script>
