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
      <p
        class="
          margin-bottom--1
          font-bold
        "
      >
        {{ t(`entities.prospect.conformity.conformityDocuments.documentTypeLabels.${item.type}`) }}
      </p>

      <PUploadFileLine
        v-for="document in item.documents"
        :key="document.id"
        pIsMultiLine
        :pFileName="document.fileName"
        pStatus="success"
        :pIconName="getIconName(document.fileName, 'filetypeNone')"
        :pHasButton="isCollab === true && isCompleted === false"
        pButtonIconName="trash"
        :pTitleButton="t('entities.prospect.conformity.conformityDocuments.uploadDeleteButtonTitle')"
        @on-click-file-action="onRequestDocumentDeletion(document)"
      />
      <PUpload
        v-if="item.documents.length < item.maxFiles"
        pDrag
        pShowFileList
        :pMultiple="item.maxFiles - item.documents.length > 1"
        :limit="item.maxFiles - item.documents.length"
        :pUploadType="PUploadType.FILE_LINE"
        :pAccept="PROSPECT_DOCUMENT_ACCEPTED_FORMATS"
        :pPrefixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadPrefixLabel')"
        :pSuffixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadSuffixLabel')"
        :pAuthorizedFileFormat="t('entities.prospect.conformity.conformityDocuments.uploadAuthorizedFormats')"
        :pTextLimitSize="t('entities.prospect.conformity.conformityDocuments.uploadMaxSize')"
        :pDeleteButtonTitle="t('entities.prospect.conformity.conformityDocuments.uploadDeleteButtonTitle')"
        :pMaxFileSize="PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB"
        @files-selected="onFileSelected(item.type, item.maxFiles - item.documents.length, $event)"
        @delete-file="onUploadFileDeleted(item.type, $event)"
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
        pType="secondary"
        class="flex--grow-1 flex--basis-0"
        @click="openDocumentsConsultDrawer"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.consult') }}
      </PButton>
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
import { SupportingDocumentType } from '@entities/enums'
import { getRawFile } from '@pulse/styleguide'
import type { UploadFile, UploadRawFile } from '@pulse/styleguide/types'
import {
  PButton,
  PUpload,
  PUploadFileLine,
} from '@pulse/styleguide/components'
import ConformitySectionSkeleton from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '@entities/modules/entity/prospect/conformity/components/conformity-section-skeleton/conformity-section-skeleton.enums'
import { getIconName } from '@pulse/styleguide/utils/fileExtension'
import { PUploadType } from '@pulse/styleguide/types'
import { useDocumentsConsultDrawerStore } from '@entities/modules/entity/prospect/documents/documents-consult-drawer/documents-consult-drawer.store'
import DeleteDocumentDialog from '@entities/modules/entity/prospect/dialog/delete-document-dialog/delete-document-dialog.vue'
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
  isDeleteDialogOpen,
  documentPendingDeletion,
  onFileSelected,
  onRemoveSelectedFile,
  onSave,
  onRequestDocumentDeletion,
  onDocumentDeleted,
} = useSupportingDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.conformityDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.conformityDocuments.saveError'),
  getItems: () => props.items,
}, emit)

const { openDocumentsConsultDrawer } = useDocumentsConsultDrawerStore()

const onUploadFileDeleted = (documentType: SupportingDocumentType, deletedFile: UploadFile | UploadRawFile): void => {
  const rawFile = getRawFile(deletedFile)
  if (rawFile !== undefined) {
    onRemoveSelectedFile(documentType, rawFile)
  }
}
</script>
