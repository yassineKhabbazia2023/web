<template>
  <div>
    <PButton
      pType="secondary"
      class="margin-right--4 previous-button"
      data-testid="previousButton"
      @click="emit('click-previous')"
    >
      {{ previousLabel }}
    </PButton>
    <PButton
      pType="primary"
      data-testid="nextButton"
      :pDisabled="props.isNextButtonDisabled"
      :pLoading="props.isNextButtonLoading"
      @click="emit('click-next')"
    >
      {{ nextLabel }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import type { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'
import { PButton } from '@pulse/styleguide/components'

const props = withDefaults(defineProps<NextPreviousButtonsProps>(), {
  isNextButtonDisabled: false,
  isNextButtonLoading: false,
})

const emit = defineEmits<{
  'click-previous': []
  'click-next': []
}>()
</script>

<style scoped lang="scss">
.previous-button {
  &:hover, &:active {
    background-color: var(--p-black-rock-900);
    color: var(--p-white);
    border-color: var(--p-black-rock-900);
  }
}
</style>
