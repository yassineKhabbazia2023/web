<template>
  <ElDialog
    v-model="visible"
    @close="handleClose"
    :lockScroll="false"
    class="p-dialog-style"
  >
    <slot></slot>
    <template #footer>
        <slot name="footer"></slot>
    </template>
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

<style lang="scss">
.p-dialog-style {
  border-radius: 16px;

  .el-dialog__headerbtn .el-dialog__close {
    color: var(--el-text-color-regular);
  }

  .el-dialog__title {
    display: flex;
    color: var(--el-text-color-regular);
  }
}
</style>

