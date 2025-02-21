<template>
  <ElDialog
    v-model="dialogModel"
    :lockScroll="pLockScroll"
    class="p-dialog"
    :title="pTitle"
    :width="pWidth"
    :modal="pModal"
    :center="pCenter"
    :alignCenter="pAlignCenter"
    :showClose="pShowClose"
    :destroyOnClose="pDestroyOnClose"
    :closeIcon="closeIcon"
    @close="handleClose"
  >
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { computed } from 'vue'
import type { PDialogProps } from './PDialogTypes'
import { getIconComponent } from '../../utils/iconHelper'

const props = withDefaults(defineProps<PDialogProps>(), {
  pLockScroll: false,
  pTitle: '',
  pWidth: '40%',
  pModal: true,
  pCenter: false,
  pBeforeClose: () => {},
  pShowClose: true,
  pAlignCenter: false,
  pDestroyOnClose: false,
  pCloseIconName: 'x',
})

const dialogModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const closeIcon = computed(() => getIconComponent(props.pCloseIconName))

const emit = defineEmits([
  'update:modelValue',
  'close',
])

const handleClose = () => {
  emit('update:modelValue', false)
}

defineExpose({ handleClose })
</script>
