<template>
  <PFormItem>
    <template #label>
      <span class="flex">
        {{ t('uploadReport') }}
        <PIcon :color="AppColors.GRAY_300" class="margin-left--2">
          <PIPatchCheck />
        </PIcon>
      </span>
    </template>
    <PUpload
      ref="uploadBIReport"
      pDrag
      pShowFileList
      pUploadType="dragger"
      :pPrefixLabelFileLine="t('prefixLabelFileLine')"
      :pSuffixLabelFileLine="t('suffixLabelFileLine')"
      pAuthorizedFileFormat="PBX"
      pTextLimitSize="100 Mo"
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
import { AppColors, PFormItem, PUpload, PIcon, PIPatchCheck } from '@pulse/styleguide'
import type { UploadBIReportProps } from './UploadBIReportTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
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

<i18n lang="yaml">
en-US:
  uploadReport: 'Please file BI report'
  prefixLabelFileLine: 'Drag file or'
  suffixLabelFileLine: 'browse computer'
fr-FR:
  uploadReport: 'Veuillez déposer le rapport BI'
  prefixLabelFileLine: 'Glisser le fichier ou'
  suffixLabelFileLine: "parcourir l'ordinateur"
</i18n>
