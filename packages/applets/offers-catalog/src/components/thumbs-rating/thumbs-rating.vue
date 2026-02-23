<template>
  <div class="thumbs-rating flex flex--align-items-center flex-gap--2">
    <span v-if="label !== undefined">{{ label }}</span>
    <PButton
      :pType="thumbsDownProperties.type"
      pSize="small"
      :pDisabled="modelValue !== null"
      @click.stop="onNegativeClick"
    >
      <PIcon pName="thumbsDown" :pColor="thumbsDownProperties.color" />
    </PButton>
    <PButton
      :pType="thumbsUpProperties.type"
      pSize="small"
      :pDisabled="modelValue !== null"
      @click.stop="onPositiveClick"
    >
      <PIcon pName="thumbsUp" :pColor="thumbsUpProperties.color" />
    </PButton>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { PButtonProps } from '@pulse/styleguide/types'
import type { ThumbsRatingProps, ThumbsRatingEmits } from './thumbs-rating.type'

defineProps<ThumbsRatingProps>()

const emit = defineEmits<ThumbsRatingEmits>()

const modelValue = defineModel<boolean | null>({ default: null })

const thumbsDownProperties = computed(() => {
  const isActive = modelValue.value === false

  return {
    color: isActive ? AppColors.RED_500 : AppColors.WHITE,
    type: (isActive ? 'default' : 'primary') as PButtonProps['pType'],
  }
})

const thumbsUpProperties = computed(() => {
  const isActive = modelValue.value === true

  return {
    color: isActive ? AppColors.JUNGLE_400 : AppColors.WHITE,
    type: (isActive ? 'default' : 'primary') as PButtonProps['pType'],
  }
})

function onPositiveClick() {
  emit('rate', true)
}

function onNegativeClick() {
  emit('rate', false)
}
</script>
