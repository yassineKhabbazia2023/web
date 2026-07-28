<template>
  <div class="beneficiary-document-upload">
    <div
      v-for="zoneData in zonesWithDocuments"
      :key="zoneData.zone.index"
      :class="{ 'margin-top--4': zoneData.zone.index > 0 }"
    >
      <PUpload
        :modelValue="formState.files[zoneData.zone.index] ?? null"
        :pLabel="t(zoneData.zone.labelKey)"
        :pUploadedFile="zoneData.document"
        :pCanDeleteUploadedFile="canDelete"
        pAccept=".pdf,.jpg,.jpeg,.png"
        :pPrefixLabelFileLine="t('entities.prospect.conformity.beneficiaries.uploadPrefixLabel')"
        :pSuffixLabelFileLine="t('entities.prospect.conformity.beneficiaries.uploadSuffixLabel')"
        :pAuthorizedFileFormat="t('entities.prospect.conformity.beneficiaries.uploadAuthorizedFormats')"
        :pTextLimitSize="t('entities.prospect.conformity.beneficiaries.uploadMaxSize')"
        :pDeleteButtonTitle="t('entities.prospect.conformity.beneficiaries.uploadDeleteButtonTitle')"
        :pMaxFileSize="PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB"
        pCanRemoteDelete
        :pRemoteDeleteUrl="remoteDeleteUrl"
        :pRemoteDeleteErrorMessage="t(`${DELETE_DOCUMENT_I18N_KEY}.error`)"
        :pDeleteConfirmationTitle="t(`${DELETE_DOCUMENT_I18N_KEY}.title`)"
        :pDeleteConfirmationMessage="getDeleteConfirmationMessage(zoneData.document)"
        :pDeleteConfirmationConfirmLabel="t(`${DELETE_DOCUMENT_I18N_KEY}.confirm`)"
        :pDeleteConfirmationCancelLabel="t(`${DELETE_DOCUMENT_I18N_KEY}.cancel`)"
        @update:model-value="(file) => emit('zone-file-changed', zoneData.zone.index, file)"
        @uploaded-file-deleted="emit('document-deleted')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PUpload } from '@pulse/styleguide/components'
import { OnboardingStepStatus } from '../../../prospect-conformity.enums'
import { PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB } from '@entities/modules/entity/prospect/prospect.constants'
import type { BeneficiaryDocument } from '@entities/modules/entity/prospect/types'
import { BeneficiariesManager } from '../../beneficiaries.manager'
import { BeneficiaryDocumentUploadManager } from './beneficiary-document-upload.manager'
import type {
  BeneficiaryDocumentUploadProps,
  BeneficiaryDocumentUploadEmits,
} from './beneficiary-document-upload.types'

const { t } = useI18n()

// Same wording as the shared DeleteDocumentDialog still used by other sections.
const DELETE_DOCUMENT_I18N_KEY = 'entities.prospect.deleteDocumentDialog'

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

const getDeleteConfirmationMessage = (document: BeneficiaryDocument | undefined) =>
  t(`${DELETE_DOCUMENT_I18N_KEY}.confirmation`, { fileName: document?.fileName ?? '' })
</script>
