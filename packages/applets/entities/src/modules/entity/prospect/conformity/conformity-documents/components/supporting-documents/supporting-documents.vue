<template>
  <ConformitySectionSkeleton
    v-if="isLoading"
    :variant="skeletonVariant"
  />
  <div
    v-else
    class="
      supporting-documents
      flex
      flex--direction-column
      flex--grow-1
    "
  >
    <p
      class="
        supporting-documents__description
        font-size--14
        margin--0
        margin-bottom--6
      "
    >
      {{ t('entities.prospect.conformity.conformityDocuments.description') }}
    </p>

    <div
      v-for="item in items"
      :key="item.type"
      class="margin-bottom--4"
    >
      <PUploadMultiple
        :modelValue="selectedFilesByType[item.type] ?? []"
        :pLabel="t(`entities.prospect.conformity.conformityDocuments.documentTypeLabels.${item.type}`)"
        :pUploadedFiles="item.documents"
        :pCanDeleteUploadedFiles="isCollab === true && isCompleted === false"
        :pMaxFiles="item.maxFiles"
        :pAccept="PROSPECT_DOCUMENT_ACCEPTED_FORMATS"
        :pPrefixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadPrefixLabel')"
        :pSuffixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadSuffixLabel')"
        :pAuthorizedFileFormat="t('entities.prospect.conformity.conformityDocuments.uploadAuthorizedFormats')"
        :pTextLimitSize="t('entities.prospect.conformity.conformityDocuments.uploadMaxSize')"
        :pDeleteButtonTitle="t('entities.prospect.conformity.conformityDocuments.uploadDeleteButtonTitle')"
        :pMaxFileSize="PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB"
        @update:model-value="(files) => selectedFilesByType[item.type] = files"
        @delete-uploaded-file="(documentId) => onUploadedDocumentDeletionRequested(item, documentId)"
      />
    </div>

    <div
      class="
        supporting-documents__footer
        flex
        flex--align-items-center
        flex-gap--3
        margin-top--2
      "
    >
      <PButton
        pType="primary"
        class="flex--grow-1 flex--basis-0"
        :pDisabled="canSave === false || isCompleted"
        :pLoading="isSaving"
        @click="onSave"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.save') }}
      </PButton>
    </div>

    <DeleteDocumentDialog
      v-model="isDeleteDialogOpen"
      :accountId="currentEntityId!"
      :pDocumentId="documentPendingDeletion?.document.id ?? undefined"
      :pFileName="documentPendingDeletion?.document.fileName ?? undefined"
      @deleted="onDocumentDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import {
  PButton,
  PUploadMultiple,
} from '@pulse/styleguide/components'
import ConformitySectionSkeleton from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section-skeleton.enums'
import DeleteDocumentDialog from '@entities/modules/entity/prospect/dialog/delete-document-dialog/delete-document-dialog.vue'
import type { SupportingDocumentItem } from '@entities/services/conformity-documents'
import { useSupportingDocuments } from './supporting-documents.composable'
import type { SupportingDocumentsEmits, SupportingDocumentsProps } from './supporting-documents.types'
import {
  PROSPECT_DOCUMENT_ACCEPTED_FORMATS,
  PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB,
} from '@entities/modules/entity/prospect/prospect.constants'

const { t } = useI18n()

const { isCollab } = storeToRefs(useUserStore())

const props = defineProps<SupportingDocumentsProps>()
const emit = defineEmits<SupportingDocumentsEmits>()

// Once completed the section is read-only (uploaded file lines); otherwise it shows upload zones.
const skeletonVariant = computed(() =>
  props.isCompleted
    ? ConformitySkeletonVariant.SupportingDocumentsList
    : ConformitySkeletonVariant.SupportingDocumentsUpload,
)

const {
  currentEntityId,
  isSaving,
  canSave,
  selectedFilesByType,
  isDeleteDialogOpen,
  documentPendingDeletion,
  onSave,
  onRequestDocumentDeletion,
  onDocumentDeleted,
} = useSupportingDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.conformityDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.conformityDocuments.saveError'),
  getItems: () => props.items,
}, emit)

// PUploadMultiple emits the persisted document id; the confirmation dialog needs the document itself.
const onUploadedDocumentDeletionRequested = (item: SupportingDocumentItem, documentId: string | number): void => {
  const document = item.documents.find((uploadedDocument) => uploadedDocument.id === documentId)
  if (document !== undefined) {
    onRequestDocumentDeletion(document)
  }
}
</script>
