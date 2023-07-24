<template>
  <el-date-picker
    :prefixIcon="PICalendarEvent">
    <slot />
  </el-date-picker>
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import { PICalendarEvent } from '@/atoms/PIcon/components'
</script>
