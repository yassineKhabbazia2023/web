<template>
  <ElDropdown
    ref="dropdownRef"

    :class="{ 'p-toolbox--floating': pCoordinates }"
    :popperClass="`p-toolbox shadow--3 ${pPopperClass}`"
    :placement="pPlacement"
    :style="computedStyle"
    :trigger="pTrigger"
    @visible-change="$emit('visible-change', $event)"
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
import { computed, ref, watch } from 'vue'
import PToolboxItem from '../../atoms/PToolboxItem'
import type { PToolboxProps } from './PToolboxTypes'

const props = withDefaults(defineProps<PToolboxProps>(), {
  pElements: () => [],
  pPlacement: 'bottom-start',
  pTrigger: 'hover',
  pCoordinates: undefined,
  pPopperClass: '',
})

defineEmits(['p-toolbox-item-clicked', 'visible-change'])

const dropdownRef = ref()
const dropdownHtmlWrapper = ref<HTMLElement | null>(null)
const xAxisOffset = ref(0)

const computedStyle = computed(() => ({
  top: `${props.pCoordinates?.y}px`,
  left: `${xAxisOffset.value}px`,
}))

const updateXAxisOffset = (x: number) => {
  if (dropdownHtmlWrapper.value) {
    xAxisOffset.value = x - dropdownHtmlWrapper.value.getBoundingClientRect().width / 2
  }
}

// We need this watcher because ElementPlus doesnt update visible-change when the user do multiple right click.
watch(() => props.pCoordinates?.x, () => {
  setTimeout(() => {
    dropdownHtmlWrapper.value = document.querySelector('.p-toolbox--floating .el-popper') as HTMLElement
    if (dropdownHtmlWrapper.value) {
      if (props.pCoordinates?.x) {
        updateXAxisOffset(props.pCoordinates.x)
      }
    }
  }, 10)
})
</script>
