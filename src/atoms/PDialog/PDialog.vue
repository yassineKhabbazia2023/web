<template>
  <ElDialog
    v-model="visible"
    @close="handleClose"
  >
    <slot></slot>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { ref } from 'vue'

const props = defineProps(['visible'])
const visible = ref(props.visible)

const emit = defineEmits(['update:visible'])

const handleClose = () => {
  emit('update:visible', false)
}

defineExpose({ handleClose })
</script>
