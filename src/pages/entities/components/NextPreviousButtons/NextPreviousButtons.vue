<template>
  <div>
    <PButton
      pType="default"
      class="margin-right--4"
      @click="emit('clickPrevious')"
      data-ut="previousButton"
    >
      <PIcon class="el-button__icon--left">
        <PIArrowLeft />
      </PIcon>
      {{ previousLabel }}
    </PButton>

    <PButton
      data-ut="nextButton"
      pType="primary"
      @click="emit('clickNext')"
    >
      {{ nextLabel }}
      <PIcon class="el-button__icon--right">
        <PIArrowRight />
      </PIcon>
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'
import { PButton, PIcon, PIArrowLeft, PIArrowRight } from '@kpmg/styleguide'

defineProps<NextPreviousButtonsProps>()

const emit = defineEmits<{
  'clickPrevious': [],
  'clickNext': []
}>()
</script>
