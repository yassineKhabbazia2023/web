<template>
  <ElTabs
    v-model="selectedTabName"
    :type="tab.type"
    :class="cssClasses"
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

const nativeTypes = ['card', 'border-card']

const props = withDefaults(defineProps<PTabsProps>(), {
  pType: '',
  pClosable: false,
  pAddable: false,
  pEditable: false,
  pTabPosition: 'top',
  pStretch: false,
  pBeforeLeave: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [string | number]
}>()

const tab = computed(() => getTabType(props.pType))

const getTabType = (tabType: any) => (
  {
    tabType,
    type: nativeTypes.includes(tabType) ? tabType : '',
  })

const selectedTabName = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue),
})

const cssClasses = computed(() => {
  const classes = ['p-tabs']

  if (props.pType !== '') {
    classes.push(`p-tabs--${props.pType}`)
  }
  if (props.pSmartWidth === true) {
    classes.push('smart-width')
  }

  return classes
})
</script>
