<template>
  <ElUpload
    ref="uploadElement"
    class="p-upload"
    :class="pClassMapper"
    :httpRequest="emitFilesEvent"
    v-model:file-list="files"
    :multiple="pMultiple"
    :showFileList="pShowFileList"
    :drag="pDrag"
    :disabled="pDisabled"
    :accept="pAccept"
    :action="pAction"
  >
    <slot v-if="pUploadType === 'slot'" />
    <div v-if="pUploadType === 'file-line'" class="p-upload__input flex flex--align-items-center">
      <PIcon
        color="#5546FF"
        size="16"
        class="margin-right--2"
      >
        <PIUpload />
      </PIcon>
      <span data-testid="upload-input-content">
        {{ pPrefixLabelFileLine }}
        <span class="font-semibold color-primary">{{ pSuffixLabelFileLine }}</span>
        (max. {{ pTextLimitSize }})
      </span>
    </div>
    <template v-if="pShowFileList" #file="{ file }">
      <PUploadFileLine
        :pFile="file"
        :pStatus="file.status"
        :pIcon="getFileIcon(file.name)"
        pHasButton
        pButtonIcon="PITrash"
        pTitleButton="Supprimer le document"
        @on-click-file-action="removeFile(file)"
      />
    </template>
  </ElUpload>
</template>

<script setup lang="ts">
import { ElUpload, type UploadFile, type UploadRawFile } from 'element-plus'
import { ref, computed } from 'vue'
import { getFileIcon } from '@/utils/fileExtension'
import PIcon from '@/atoms/PIcon'
import { PIUpload } from '@/atoms/PIcon/components'
import PUploadFileLine from '@/atoms/PUploadFileLine'
import type { UploadProps } from './PUploadTypes'

const uploadElement = ref<InstanceType<typeof ElUpload> | null>(null)

function removeFile(file: UploadFile | UploadRawFile) {
  uploadElement.value?.handleRemove(file)
}

const props = withDefaults(defineProps<UploadProps>(), {
  pUploadType: 'slot',
  pShowFileList: false,
  pAction: '#',
})

const pClassMapper = computed(() => ({
  [`p-upload--type-${props.pUploadType}`]: true,
}))

const emit = defineEmits<{
  'files-selected': [File[]]
}>()

const files = ref<UploadFile[]>([])

const emitFilesEvent = () => {
  const filesToUpload = files.value.map((file) => file.raw as File)
  return new Promise((resolve) => {
    resolve(emit('files-selected', filesToUpload))
  })
}
</script>

<style lang="scss">
  .color-primary {
    color: var(--el-color-persian-500);
  }

  .p-upload {
    display: inline-block;
    width: auto;
    max-width: 100%;

    &--type {
      &-file-line {
        .el-upload {
          position: relative;
          z-index: 1;
          background: var(--el-fill-color-blank);

          &:focus {
            color: inherit;
          }
        }
        .el-upload-dragger {
          border-style: solid;
          border-radius: 4px;
          text-align: left;
        }
      }
    }

    .el-upload-list {
      margin-top: 0.8rem;

      &__item {
        margin-bottom: 0;
        border-bottom: 1px solid transparent;
        border-radius: 0;

        &:hover {
          background: inherit;
        }

        &:not(:last-child) {
          border-color: var(--el-color-neutral-gray-100);
        }

        & + .el-upload-list__item {
          margin-top: 0.8rem;
        }
      }
    }

    .el-upload {
      display: inline-block;
      width: 100%;
    }
  }
</style>
