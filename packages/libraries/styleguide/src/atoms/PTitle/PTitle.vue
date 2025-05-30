<template>
  <h3 class="p-title h3 font-semibold flex items-center">
    <PIcon
      :pName="pIconName"
      :pColor="AppColors.PRIMARY"
      pSize="28"
    />
    <span class="margin-left--2">
      {{ pTitle }}
    </span>
  </h3>
</template>

<script setup lang="ts">
import PIcon from '../PIcon'
import type { PTitleProps } from './PTitleTypes'
import { AppColors } from '../../utils/AppColorsEnum'

withDefaults(defineProps<PTitleProps>(), {
  pIconName: 'pulse',
})
</script>
