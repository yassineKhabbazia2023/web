<template>
  <div
    class="
      conformity-documents
      flex
      flex--direction-column
      flex--grow-1
    "
  >
    <div
      v-if="isLoading === false"
      class="
        flex
        flex--direction-column
      "
    >
      <p
        class="
          conformity-documents__description
          font-size--14
          margin--0
          margin-bottom--6
        "
      >
        {{ t('entities.prospect.conformity.conformityDocuments.description') }}
      </p>

      <div
        v-for="requiredDocument in requiredDocuments"
        :key="requiredDocument.type"
        class="margin-bottom--4"
      >
        <PUploadFileLine
          v-if="ConformityDocumentsManager.isUploaded(requiredDocument)"
          :pFileName="requiredDocument.fileName ?? requiredDocument.label"
          pStatus="success"
          :pIconName="getIconName(requiredDocument.fileName ?? '', 'filetypeNone')"
          :pHasButton="isComplete === false && isCollab === true"
          pButtonIconName="trash"
          :pTitleButton="t('entities.prospect.conformity.conformityDocuments.uploadDeleteButtonTitle')"
          @on-click-file-action="onRequestDocumentDeletion(requiredDocument)"
        />
        <PUpload
          v-else-if="isComplete === false"
          pDrag
          pShowFileList
          :pUploadType="PUploadType.FILE_LINE"
          :pLabel="requiredDocument.label"
          :pAccept="CONFORMITY_DOCUMENT_ACCEPTED_FORMATS"
          :pPrefixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadPrefixLabel')"
          :pSuffixLabelFileLine="t('entities.prospect.conformity.conformityDocuments.uploadSuffixLabel')"
          :pAuthorizedFileFormat="t('entities.prospect.conformity.conformityDocuments.uploadAuthorizedFormats')"
          :pTextLimitSize="t('entities.prospect.conformity.conformityDocuments.uploadMaxSize')"
          :pDeleteButtonTitle="t('entities.prospect.conformity.conformityDocuments.uploadDeleteButtonTitle')"
          :pMaxFileSize="CONFORMITY_DOCUMENT_MAX_FILE_SIZE_MB"
          @files-selected="onFileSelected(requiredDocument.type, $event)"
          @delete-file="onRemoveSelectedFile(requiredDocument.type)"
        />
      </div>
    </div>

    <div
      class="
        conformity-documents__footer
        flex
        flex--align-items-center
        flex-gap--3
        margin-top--auto
      "
    >
      <PButton
        pType="secondary"
        class="flex--grow-1 flex--basis-0"
        @click="openDrawer"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.consult') }}
      </PButton>
      <PButton
        v-if="canMarkSectionCompleted"
        pType="primary"
        class="flex--grow-1 flex--basis-0"
        :pLoading="isMarkingCompleted"
        @click="onMarkSectionCompleted"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.markSectionCompleted') }}
      </PButton>
      <PButton
        v-else-if="isLoading === false && isComplete === false"
        pType="primary"
        class="flex--grow-1 flex--basis-0"
        :pDisabled="hasPendingUploads === false"
        :pLoading="isSaving"
        @click="onSave"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.save') }}
      </PButton>
    </div>

    <PDrawer
      v-model="isDrawerOpen"
      :pTitle="t('entities.prospect.conformity.conformityDocuments.drawerTitle')"
      pSize="50%"
      @close-drawer-button="closeDrawer"
    >
      <PAlert
        pType="information"
        class="margin-bottom--4"
      >
        {{ t('entities.prospect.conformity.conformityDocuments.drawerAlert') }}
      </PAlert>
      <DocumentsList
        v-if="isDrawerOpen"
        :visibleColumns="drawerVisibleColumns"
      />
      <template #footer>
        <PDrawerActions
          :pPrimaryCTA="{ pLabel: t('entities.prospect.conformity.conformityDocuments.drawerClose') }"
          @click-primary-cta="closeDrawer"
        />
      </template>
    </PDrawer>

    <DeleteDocumentDialog
      v-model="isDeleteDialogOpen"
      :pProspectId="prospectId!"
      :pDocumentId="documentPendingDeletion?.document.fileUploadedId ?? undefined"
      :pFileName="documentPendingDeletion?.document.fileName ?? undefined"
      @deleted="onDocumentDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import {
  PAlert,
  PButton,
  PDrawer,
  PDrawerActions,
  PUpload,
  PUploadFileLine,
} from '@pulse/styleguide/components'
import { getIconName } from '@pulse/styleguide/utils/fileExtension'
import { PUploadType } from '@pulse/styleguide/types'
import type { PDocumentsListColumn } from '@pulse/styleguide/types'
import DocumentsList from '../../documents/documents-list/documents-list.vue'
import DeleteDocumentDialog from '../../dialog/delete-document-dialog/delete-document-dialog.vue'
import { useConformityDocuments } from './conformity-documents.composable'
import { ConformityDocumentsManager } from './conformity-documents.manager'
import {
  CONFORMITY_DOCUMENT_ACCEPTED_FORMATS,
  CONFORMITY_DOCUMENT_MAX_FILE_SIZE_MB,
} from './conformity-documents.constants'

const { t } = useI18n()

const { isCollab } = storeToRefs(useUserStore())

const {
  prospectId,
  isLoading,
  isSaving,
  isMarkingCompleted,
  isComplete,
  requiredDocuments,
  hasPendingUploads,
  canMarkSectionCompleted,
  isDeleteDialogOpen,
  documentPendingDeletion,
  onFileSelected,
  onRemoveSelectedFile,
  onSave,
  onRequestDocumentDeletion,
  onDocumentDeleted,
  onMarkSectionCompleted,
} = useConformityDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.conformityDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.conformityDocuments.saveError'),
  markCompletedErrorMessage: t('entities.prospect.conformity.conformityDocuments.markSectionCompletedError'),
})

const isDrawerOpen = ref(false)

const drawerVisibleColumns: PDocumentsListColumn[] = ['name', 'depositDate', 'options']

const openDrawer = (): void => {
  isDrawerOpen.value = true
}

const closeDrawer = (): void => {
  isDrawerOpen.value = false
}
</script>
