<template>
  <ElDialog
    v-model="visible"
    @close="handleClose"
    :lockScroll="false"
    class="custom-dialog-style"
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
$dialog-background-color: var(--pulse-color-neutral-blanc, #FFF);
$dialog-box-shadow: 0px 16px 40px 1px rgba(112, 144, 176, 0.15),
                    0px 8px 8px 0px rgba(112, 144, 176, 0.05),
                    0px 4px 4px 0px rgba(112, 144, 176, 0.08),
                    0px 2px 2px 0px rgba(112, 144, 176, 0.05),
                    0px 1px 2px 0px rgba(112, 144, 176, 0.10);

.custom-dialog-style {
  border-radius: 16px;
  background: $dialog-background-color;
  box-shadow: $dialog-box-shadow;

  .el-dialog__headerbtn .el-dialog__close {
    color: var(--pulse-color-neutral-gray-900);
  }

  .el-dialog__title {
    display: flex;
  }
}
</style>

