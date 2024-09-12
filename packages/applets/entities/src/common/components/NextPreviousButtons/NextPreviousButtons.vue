<template>
  <div>
    <PButton
      pType="default"
      class="margin-right--4"
      @click="emit('clickPrevious')"
      data-testid="previousButton"
    >
      {{ previousLabel }}
    </PButton>
    <PButton
      pType="primary"
      @click="emit('clickNext')"
      data-testid="nextButton"
      :pDisabled="props.isNextButtonDisabled"
      :pLoading="props.isNextButtonLoading"
    >
      {{ nextLabel }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import type { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'
import { PButton } from '@kpmg/styleguide'

const props = withDefaults(defineProps<NextPreviousButtonsProps>(), {
  isNextButtonDisabled: false,
  isNextButtonLoading: false,
})

const emit = defineEmits<{
  clickPrevious: []
  clickNext: []
}>()
</script>
