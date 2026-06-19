<template>
  <PToolbox
    :trigger="pTrigger"
    :pElements="pElements"
    :pPlacement="pPlacement"
    :pElementsTestId="pElementsTestId"
    @p-toolbox-item-clicked="$emit('p-item-clicked', $event)"
    @visible-change="$emit('visible-change', $event)"
  >
    <PButton v-bind="buttonProps">
      <slot />
      <PIcon class="margin-left--2" pName="chevronDown" />
    </PButton>
  </PToolbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PToolbox from '../PToolbox'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import type { PToolboxButtonProps } from './PToolboxButtonTypes'

const props = withDefaults(defineProps<PToolboxButtonProps>(), {
  pElements: () => [],
  pType: 'active',
  pTrigger: 'click',
  pPlacement: 'bottom-end',
})

defineEmits(['p-item-clicked', 'visible-change'])

const buttonProps = computed(() => {
  const { pElements, pTrigger, pPlacement, pElementsTestId, ...rest } = props
  return rest
})
</script>
