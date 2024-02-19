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
    >
      {{ nextLabel }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'
import { PButton } from '@kpmg/styleguide'

defineProps<NextPreviousButtonsProps>()

const emit = defineEmits<{
  clickPrevious: []
  clickNext: []
}>()
</script>
