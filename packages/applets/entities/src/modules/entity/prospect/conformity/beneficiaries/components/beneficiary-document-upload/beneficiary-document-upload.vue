<template>
  <div class="beneficiary-document-upload">
    <div
      v-for="zoneData in zonesWithDocuments"
      :key="zoneData.zone.index"
      :class="{ 'margin-top--4': zoneData.zone.index > 0 }"
    >
      <p
        class="
          margin-bottom--1
          font-bold
        "
      >
        {{ t(zoneData.zone.labelKey) }}
      </p>

      <!-- Existing document at this zone -->
      <PUploadFileLine
        v-if="zoneData.document"
        pIsMultiLine
        :pFileName="zoneData.document.fileName"
        pStatus="success"
        :pIconName="getIconName(zoneData.document.fileName, 'filetypeNone')"
        :pHasButton="canDelete"
        pButtonIconName="trash"
        :pTitleButton="t('entities.prospect.conformity.beneficiaries.uploadDeleteButtonTitle')"
        @on-click-file-action="emit('document-deletion-requested', zoneData.document)"
      />

      <!-- Upload zone when no document at this index -->
      <PUpload
        v-else
        :key="`${beneficiary.beneficiaryId}-${formState.documentType}-${zoneData.zone.index}`"
        pDrag
        pShowFileList
        :pUploadType="PUploadType.FILE_LINE"
        pAccept=".pdf,.jpg,.jpeg,.png"
        :pPrefixLabelFileLine="t('entities.prospect.conformity.beneficiaries.uploadPrefixLabel')"
        :pSuffixLabelFileLine="t('entities.prospect.conformity.beneficiaries.uploadSuffixLabel')"
        :pAuthorizedFileFormat="t('entities.prospect.conformity.beneficiaries.uploadAuthorizedFormats')"
        :pTextLimitSize="t('entities.prospect.conformity.beneficiaries.uploadMaxSize')"
        :pMaxFileSize="BENEFICIARY_MAX_FILE_SIZE_MB"
        :limit="1"
        @files-selected="onFilesSelected(zoneData.zone.index, $event)"
        @delete-file="onFileDeleted(zoneData.zone.index, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadFile, UploadRawFile } from 'element-plus'
import { PUpload, PUploadFileLine } from '@pulse/styleguide/components'
import { getIconName } from '@pulse/styleguide/utils/fileExtension'
import { PUploadType } from '@pulse/styleguide/types'
import { OnboardingStepStatus } from '../../../prospect-conformity.enums'
import { BENEFICIARY_MAX_FILE_SIZE_MB } from '../../beneficiaries.constants'
import { BeneficiariesManager } from '../../beneficiaries.manager'
import { BeneficiaryDocumentUploadManager } from './beneficiary-document-upload.manager'
import type {
  BeneficiaryDocumentUploadProps,
  BeneficiaryDocumentUploadEmits,
} from './beneficiary-document-upload.types'

const { t } = useI18n()

const props = defineProps<BeneficiaryDocumentUploadProps>()

const emit = defineEmits<BeneficiaryDocumentUploadEmits>()

const uploadZones = computed(() =>
  BeneficiaryDocumentUploadManager.getRequiredZones(props.formState.documentType),
)

const canDelete = computed(() =>
  props.beneficiaryStepStatus !== OnboardingStepStatus.Completed,
)

const zonesWithDocuments = computed(() =>
  uploadZones.value.map((zone) => ({
    zone,
    document: BeneficiariesManager.getDocumentForZone(props.beneficiary, zone.index),
  })),
)

const onFilesSelected = (zoneIndex: number, files: File[]) => {
  emit('files-selected', zoneIndex, files)
}

const onFileDeleted = (zoneIndex: number, file: UploadFile | UploadRawFile) => {
  emit('file-deleted', zoneIndex, file)
}
</script>
