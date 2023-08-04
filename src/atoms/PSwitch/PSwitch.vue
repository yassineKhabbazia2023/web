<template>
  <el-switch v-model="isToggled" />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps(['value'])
const isToggled = ref(props.value)

watch(() => props.value, newVal => {
  isToggled.value = newVal
})
</script>
