<template>
  <el-switch v-model="computedValue" />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps(['value'])
const computedValue = ref(props.value)

watch(() => props.value, newVal => {
  computedValue.value = newVal
})
</script>
