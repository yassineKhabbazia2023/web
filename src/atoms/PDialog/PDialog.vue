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
  box-shadow: 0px 16px 40px 1px rgba(112, 144, 176, 0.15),
    0px 8px 8px 0px rgba(112, 144, 176, 0.05),
    0px 4px 4px 0px rgba(112, 144, 176, 0.08),
    0px 2px 2px 0px rgba(112, 144, 176, 0.05),
    0px 1px 2px 0px rgba(112, 144, 176, 0.1);

  .el-dialog__headerbtn .el-dialog__close {
    color: var(--el-text-color-regular);
  }

  .el-dialog__title {
    display: flex;
    color: var(--el-text-color-regular);
  }

  .el-dialog__body {
    padding: 24px 16px;
  }
}
</style>

