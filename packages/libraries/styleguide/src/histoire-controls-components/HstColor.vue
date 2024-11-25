<template>
  <label class="container">
    <span
      class="title"
    >
      {{ title }}
    </span>
    <ElColorPicker
      v-model="colorModel"
      size="small"
      showAlpha
      :predefine="predefineColors"
    />
  </label>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { ElColorPicker } from 'element-plus'

export default {
  name: 'HstColor',
  inheritAttrs: false,
}
</script>

<script setup lang="ts">

const props = defineProps<{
  title?: string
  modelValue: string
}>()

const emit = defineEmits({
  'update:modelValue': (newValue: string) => true,
})

const colorModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsl(181, 100%, 37%)',
])
</script>

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
