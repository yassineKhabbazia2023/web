<template>
  <ElDatePicker
    :prefixIcon="PICalendarEvent"
  >
    <slot />
  </ElDatePicker>
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import { PICalendarEvent } from '@/atoms/PIcon/components'
</script>
