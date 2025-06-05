<template>
  <h3 class="p-title h3 font-semibold flex flex--align-items-center">
    <PIcon
      :pName="pIconName"
      :pColor="pIconColor"
      :pSize="pIconSize"
    />
    <span class="text-color--base-blue-pulse margin-left--2">
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
  pIconSize: '28',
  pIconColor: AppColors.PRIMARY,
})
</script>
