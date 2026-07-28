<template>
  <ConformitySectionSkeleton
    v-if="isLoading"
    :variant="ConformitySkeletonVariant.ComplementaryDocuments"
  />
  <div
    v-else
    class="
      complementary-documents
      flex
      flex--direction-column
      flex--grow-1
    "
  >
    <p
      class="
        complementary-documents__description
        font-size--14
        margin--0
        margin-bottom--6
      "
    >
      {{ t('entities.prospect.conformity.complementaryDocuments.description') }}
    </p>

    <PUploadMultiple
      v-model="selectedFiles"
      :pUploadedFiles="documents"
      :pCanDeleteUploadedFiles="false"
      :pMaxFiles="maxFiles"
      :pLabel="t('entities.prospect.conformity.complementaryDocuments.uploadLabel')"
      :pAccept="PROSPECT_DOCUMENT_ACCEPTED_FORMATS"
      :pPrefixLabelFileLine="t('entities.prospect.conformity.complementaryDocuments.uploadPrefixLabel')"
      :pSuffixLabelFileLine="t('entities.prospect.conformity.complementaryDocuments.uploadSuffixLabel')"
      :pAuthorizedFileFormat="t('entities.prospect.conformity.complementaryDocuments.uploadAuthorizedFormats')"
      :pTextLimitSize="t('entities.prospect.conformity.complementaryDocuments.uploadMaxSize')"
      :pDeleteButtonTitle="t('entities.prospect.conformity.complementaryDocuments.uploadDeleteButtonTitle')"
      :pMaxFileSize="PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB"
    />

    <div
      class="
        complementary-documents__footer
        flex
        flex--align-items-center
        flex-gap--3
        margin-top--6
      "
    >
      <PButton
        pType="primary"
        class="flex--grow-1 flex--basis-0"
        :pDisabled="hasPendingUploads === false"
        :pLoading="isSaving"
        @click="onSave"
      >
        {{ t('entities.prospect.conformity.complementaryDocuments.save') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PButton,
  PUploadMultiple,
} from '@pulse/styleguide/components'
import ConformitySectionSkeleton from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section-skeleton.enums'
import { useComplementaryDocuments } from './complementary-documents.composable'
import type { ComplementaryDocumentsEmits, ComplementaryDocumentsProps } from './complementary-documents.types'
import {
  PROSPECT_DOCUMENT_ACCEPTED_FORMATS,
  PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB,
} from '@entities/modules/entity/prospect/prospect.constants'

const { t } = useI18n()

defineProps<ComplementaryDocumentsProps>()
const emit = defineEmits<ComplementaryDocumentsEmits>()

const {
  isSaving,
  selectedFiles,
  hasPendingUploads,
  onSave,
} = useComplementaryDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.complementaryDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.complementaryDocuments.saveError'),
}, emit)
</script>
