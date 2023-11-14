<template>
  <ElUpload
    :httpRequest="emitFilesEvent"
    v-model:file-list="files"
    :multiple="pMultiple"
    :showFileList="pShowFileList"
    :drag="pDrag"
    :disabled="pDisabled"
    :accept="pAccept"
  >
    <slot />
  </ElUpload>
</template>

<script setup lang="ts">
import { ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { ref } from 'vue'
import type { UploadProps } from './PUploadTypes'

defineProps<UploadProps>()

const emit = defineEmits<{'files-selected': [File[]]}>()

const files = ref<UploadFile[]>([])

const emitFilesEvent = () => {
  const filesToUpload = files.value.map(file => file.raw as File)
  return new Promise((resolve) => {
    resolve(emit('files-selected', filesToUpload))
    files.value = []
  })
}
</script>
