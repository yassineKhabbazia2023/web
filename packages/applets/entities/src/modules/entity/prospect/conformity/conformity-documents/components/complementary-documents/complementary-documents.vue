<template>
  <div
    v-if="isLoading"
    class="flex flex--justify-content-center margin-y--4"
  >
    <PLoader
      pType="primary"
      pSize="50"
    />
  </div>
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

    <PUpload
      v-if="availableSlots > 0"
      :key="uploadResetKey"
      pMultiple
      :limit="availableSlots"
      pDrag
      pShowFileList
      :pUploadType="PUploadType.DRAGGER"
      :pLabel="t('entities.prospect.conformity.complementaryDocuments.uploadLabel')"
      :pAccept="PROSPECT_DOCUMENT_ACCEPTED_FORMATS"
      :pPrefixLabelFileLine="t('entities.prospect.conformity.complementaryDocuments.uploadPrefixLabel')"
      :pSuffixLabelFileLine="t('entities.prospect.conformity.complementaryDocuments.uploadSuffixLabel')"
      :pAuthorizedFileFormat="t('entities.prospect.conformity.complementaryDocuments.uploadAuthorizedFormats')"
      :pTextLimitSize="t('entities.prospect.conformity.complementaryDocuments.uploadMaxSize')"
      :pDeleteButtonTitle="t('entities.prospect.conformity.complementaryDocuments.uploadDeleteButtonTitle')"
      :pMaxFileSize="PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB"
      @files-selected="onFilesSelected($event, availableSlots)"
      @delete-file="onUploadFileDeleted($event)"
    />

    <div
      class="
        flex
        flex--direction-column
        margin-top--2
      "
    >
      <PUploadFileLine
        v-for="document in documents"
        :key="document.id"
        :pFileName="document.fileName"
        pStatus="success"
        :pIconName="getIconName(document.fileName, 'filetypeNone')"
        :pHasButton="isCollab === true"
        pButtonIconName="trash"
        :pTitleButton="t('entities.prospect.conformity.complementaryDocuments.uploadDeleteButtonTitle')"
        @on-click-file-action="onRequestDocumentDeletion(document)"
      />
    </div>

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
        pType="secondary"
        class="flex--grow-1 flex--basis-0"
        @click="open"
      >
        {{ t('entities.prospect.conformity.complementaryDocuments.consult') }}
      </PButton>
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

    <DeleteDocumentDialog
      v-model="isDeleteDialogOpen"
      :pProspectId="prospectId!"
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
import { getRawFile } from '@pulse/styleguide'
import type { UploadFile, UploadRawFile } from '@pulse/styleguide/types'
import {
  PButton,
  PLoader,
  PUpload,
  PUploadFileLine,
} from '@pulse/styleguide/components'
import { getIconName } from '@pulse/styleguide/utils/fileExtension'
import { PUploadType } from '@pulse/styleguide/types'
import { useDocumentsConsultDrawerStore } from '@entities/modules/entity/prospect/documents/documents-consult-drawer/documents-consult-drawer.store'
import DeleteDocumentDialog from '@entities/modules/entity/prospect/dialog/delete-document-dialog/delete-document-dialog.vue'
import { useComplementaryDocuments } from './complementary-documents.composable'
import type { ComplementaryDocumentsEmits, ComplementaryDocumentsProps } from './complementary-documents.types'
import {
  PROSPECT_DOCUMENT_ACCEPTED_FORMATS,
  PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB,
} from '@entities/modules/entity/prospect/prospect.constants'

const { t } = useI18n()

const { isCollab } = storeToRefs(useUserStore())

const props = defineProps<ComplementaryDocumentsProps>()
const emit = defineEmits<ComplementaryDocumentsEmits>()

const availableSlots = computed(() => Math.max(props.maxFiles - props.documents.length, 0))

const {
  prospectId,
  isSaving,
  uploadResetKey,
  hasPendingUploads,
  isDeleteDialogOpen,
  documentPendingDeletion,
  onFilesSelected,
  onRemoveSelectedFile,
  onSave,
  onRequestDocumentDeletion,
  onDocumentDeleted,
} = useComplementaryDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.complementaryDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.complementaryDocuments.saveError'),
}, emit)

const { open } = useDocumentsConsultDrawerStore()

const onUploadFileDeleted = (deletedFile: UploadFile | UploadRawFile): void => {
  const rawFile = getRawFile(deletedFile)
  if (rawFile !== undefined) {
    onRemoveSelectedFile(rawFile)
  }
}
</script>
