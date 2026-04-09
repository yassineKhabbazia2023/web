<template>
  <div
    class="
      flex
      flex--align-items-center
      bg--jungle-75
      padding--4
      margin-bottom--4
    "
  >
    <PIcon
      :pName="iconName"
      pSize="16px"
      :pColor="AppColors.TEAL_800"
    />
    <div class="padding-left--2">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { FeatureHighlightProps } from './feature-highlight.types'

defineProps<FeatureHighlightProps>()
</script>
