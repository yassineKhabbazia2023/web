<template>
  <PFormItem>
    <template #label>
      <span class="flex">
        {{ t('uploadReport') }}
        <PIcon
          :color="AppColors.GRAY_300"
          class="margin-left--2"
          pName="patchCheck"
        />
      </span>
    </template>
    <PUpload
      ref="uploadBIReport"
      class="p-upload-bi-report"
      pDrag
      pShowFileList
      pUploadType="dragger"
      :pPrefixLabelFileLine="t('prefixLabelFileLine')"
      :pSuffixLabelFileLine="t('suffixLabelFileLine')"
      :pDeleteButtonTitle="t('deleteButtonTitle')"
      pAuthorizedFileFormat="PBX"
      pTextLimitSize="50 Mo"
      pColorFileLine="persian"
      :pDisabled="isDisabled"
      @files-selected="handleReportUpload"
      @delete-file="emit('delete-report')"
    />
  </PFormItem>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { PFormItem, PUpload, PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { UploadBIReportProps } from './upload-bi-report.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      uploadReport: 'Please file BI report',
      prefixLabelFileLine: 'Drag file or',
      suffixLabelFileLine: 'browse computer',
      deleteButtonTitle: 'Delete document',
    },
    'fr-FR': {
      uploadReport: 'Veuillez déposer le rapport BI',
      prefixLabelFileLine: 'Glisser le fichier ou',
      suffixLabelFileLine: 'parcourir l\'ordinateur',
      deleteButtonTitle: 'Supprimer le document',
    },
  },
})

withDefaults(defineProps<UploadBIReportProps>(), {
  isDisabled: false,
})

const emit = defineEmits<{
  'upload-report': [File]
  'delete-report': []
}>()

const uploadBIReport = ref()

const handleReportUpload = (reports: File[]) => {
  emit('upload-report', reports[0])
}
const deleteUploadedReport = () => {
  uploadBIReport.value.clearFiles()
}

defineExpose({
  deleteUploadedReport,
})
</script>

<style lang="scss">
.p-upload-bi-report {
  &.p-upload--type-dragger {
    .el-upload-dragger {
      padding: 100px;
    }
  }
}
</style>

