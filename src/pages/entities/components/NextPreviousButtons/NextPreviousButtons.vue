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
      pType="primary"
      @click="emit('clickNext')"
      data-ut="nextButton"
    >
      {{ nextLabel }}
      <PIcon class="el-button__icon--right">
        <PICheck v-if="hasCheckIcon" />
        <PIArrowRight v-else />
      </PIcon>
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { NextPreviousButtonsProps } from './NextPreviousButtonsTypes'
import {
  PButton,
  PIcon,
  PIArrowLeft,
  PIArrowRight,
  PICheck
} from '@kpmg/styleguide'

defineProps<NextPreviousButtonsProps>()

const emit = defineEmits<{
  clickPrevious: []
  clickNext: []
}>()
</script>
