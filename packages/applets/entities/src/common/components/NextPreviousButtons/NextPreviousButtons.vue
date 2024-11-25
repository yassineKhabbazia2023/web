<template>
  <div>
    <PButton
      pType="default"
      class="margin-right--4"
      data-testid="previousButton"
      @click="emit('clickPrevious')"
    >
      {{ previousLabel }}
    </PButton>
    <PButton
      pType="primary"
      data-testid="nextButton"
      :pDisabled="props.isNextButtonDisabled"
      :pLoading="props.isNextButtonLoading"
      @click="emit('clickNext')"
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
  clickPrevious: []
  clickNext: []
}>()
</script>
