<script lang="ts">
import { computed } from 'vue'

export default {
  name: 'HstDateTimePicker',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
interface Props {
  title: string
  modelValue: string
  type: 'date' | 'time' | 'datetime'
}

const props = defineProps<Props>()

const emit = defineEmits({
  'update:modelValue': (newValue: string) => true
})

const dateModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <label class="container">
    <span
      class="title"
    >
      {{ title }}
    </span>
    <el-time-picker
      v-if="type === 'time'"
      v-model="dateModel"
      arrowControl
      placeholder="Arbitrary time"
    />
    <el-date-picker
      v-else
      v-model="dateModel"
      :type="type"
      :placeholder="`'Select date' ${type === 'datetime' ? 'and time' : ''}`"
    />
  </label>
</template>

<style scoped>
.container {
  padding: 0.5rem;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  display: flex;
}
.title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-shrink: 0;
  width: 7rem;
}
</style>
