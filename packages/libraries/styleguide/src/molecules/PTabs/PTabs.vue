<template>
  <ElTabs
    ref="tabs"
    v-model="selectedTabName"
    :type="tab.type"
    :class="cssClasses"
    :tabPosition="pTabPosition"
    :stretch="pStretch"
    :beforeLeave="pBeforeLeave"
    :data-testid="pTestId"
  >
    <slot />
  </ElTabs>
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { ElTabs } from 'element-plus'
import type { TabsInstance } from 'element-plus'
import type { PTabsProps } from './PTabsTypes'

const nativeTypes = ['card', 'border-card']

const props = withDefaults(defineProps<PTabsProps>(), {
  pType: '',
  pTabPosition: 'top',
  pStretch: false,
  pBeforeLeave: undefined,
  pTestId: undefined,
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

const tabsRef = useTemplateRef<TabsInstance>('tabs')

onMounted(() => {
  // Element Plus 2.14 regression: on mount, the internal scroll-to-active-tab runs before
  // the tab nav has been measured (its ResizeObserver defers the measurement by one animation
  // frame), so overflowing tabs open scrolled to the start instead of the selected tab.
  // Re-trigger the scroll once the nav measurement has landed (3 frames after mount).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tabsRef.value?.tabNavRef?.scrollToActiveTab()
      })
    })
  })
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
