<template>
  <div v-if="pLabel" class="margin-bottom--1 font-bold">
    {{ pLabel }}
  </div>
  <ElUpload
    v-if="isSingleFileUploaded === false"
    ref="uploadElement"
    v-model:file-list="files"
    class="p-upload"
    :class="pClassMapper"
    v-bind="$attrs"
    :httpRequest="emitFilesEvent"
    :multiple="pMultiple"
    :showFileList="displayedFileList"
    :drag="pDrag"
    :disabled="pDisabled"
    :accept="pAccept"
    :action="pAction"
  >
    <slot v-if="pUploadType === PUploadType.SLOT" />
    <div
      v-else
      class="
        p-upload__input
        flex flex--align-items-center flex--justify-content-center
      "
    >
      <PIcon
        v-if="pUploadType === PUploadType.FILE_LINE"
        :color="AppColors.JUNGLE_400"
        size="16"
        class="margin-right--2"
        pName="upload"
      />
      <span data-testid="upload-input-content">
        {{ pPrefixLabelFileLine }}
        <span
          class="font-semibold"
          :class="
            pDisabled
              ? 'text-color--neutral-gray-500'
              : 'text-color--persian-500'
          "
        >
          {{ pSuffixLabelFileLine }}
        </span>
        <span class="p-upload__format-size">
          {{ pAuthorizedFileFormat }} (max. {{ pTextLimitSize }})
        </span>
      </span>
    </div>
    <template v-if="displayedFileList" #file="{ file }">
      <PUploadFileLine
        :pFile="file"
        :pStatus="file.status"
        :pIconName="getIconName(file.name, 'filetypeNone')"
        pHasButton
        pButtonIconName="trash"
        :pTitleButton="pDeleteButtonTitle"
        :pColor="pColorFileLine"
        @on-click-file-action="removeFile(file)"
      />
    </template>
  </ElUpload>
  <PUploadFileLine
    v-else
    pIsMultiLine
    pStatus="ready"
    :pFile="files[0]"
    :pIconName="getIconName(files[0].name, 'filetypeNone')"
    pHasButton
    pButtonIconName="trash"
    :pTitleButton="pDeleteButtonTitle"
    data-testid="upload-single-file"
    v-bind="$attrs"
    @on-click-file-action="removeFile(files[0])"
  />
</template>

<script setup lang="ts">
import { ElUpload, type UploadFile, type UploadRawFile } from 'element-plus'
import { ref, computed } from 'vue'
import { getIconName } from '../../utils/fileExtension'
import PIcon from '../../atoms/PIcon'
import PUploadFileLine from '../../atoms/PUploadFileLine'
import type { UploadProps } from './PUploadTypes'
import { AppColors } from '../../utils/AppColorsEnum'
import { PUploadType } from './PUpload.enums'

defineOptions({ inheritAttrs: false })

const uploadElement = ref<InstanceType<typeof ElUpload> | null>(null)

function removeFile(file: UploadFile | UploadRawFile) {
  uploadElement.value?.handleRemove(file)
  files.value = files.value.filter((current) => current.uid !== file.uid)
  emit('delete-file', file)
}

const props = withDefaults(defineProps<UploadProps>(), {
  pUploadType: PUploadType.SLOT,
  pShowFileList: false,
  pAction: '#',
  pShouldClearPreviousFilesListOnUpload: false,
  pDeleteButtonTitle: 'Supprimer le document',
})

const emit = defineEmits<{
  'files-selected': [File[]]
  'delete-file': [UploadFile | UploadRawFile]
}>()

const files = ref<UploadFile[]>(props.pInitialFiles ?? [])

const isSingleFileUploaded = computed(() =>
  props.pUploadType === PUploadType.FILE_LINE
  && props.pMultiple !== true
  && files.value.length > 0,
)

const displayedFileList = computed(() =>
  props.pShowFileList === true && isSingleFileUploaded.value === false,
)

const pClassMapper = computed(() => ({
  [`p-upload--type-${props.pUploadType}`]: true,
  'p-upload--disabled': props.pDisabled,
}))

function clearFiles() {
  uploadElement.value?.clearFiles()
}

defineExpose({
  clearFiles,
})

const emitFilesEvent = () => {
  const filesToUpload = files.value.map((file) => file.raw as File)
  return new Promise((resolve) => {
    resolve(emit('files-selected', filesToUpload))
    if (props.pShouldClearPreviousFilesListOnUpload) {
      files.value = []
    }
  })
}
</script>

