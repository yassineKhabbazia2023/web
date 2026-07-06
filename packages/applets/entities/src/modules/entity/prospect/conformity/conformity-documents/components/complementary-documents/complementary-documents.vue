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
        :pHasButton="false"
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
        @click="openDocumentsConsultDrawer"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { useComplementaryDocuments } from './complementary-documents.composable'
import type { ComplementaryDocumentsEmits, ComplementaryDocumentsProps } from './complementary-documents.types'
import {
  PROSPECT_DOCUMENT_ACCEPTED_FORMATS,
  PROSPECT_DOCUMENT_MAX_FILE_SIZE_MB,
} from '@entities/modules/entity/prospect/prospect.constants'

const { t } = useI18n()

const props = defineProps<ComplementaryDocumentsProps>()
const emit = defineEmits<ComplementaryDocumentsEmits>()

const availableSlots = computed(() => Math.max(props.maxFiles - props.documents.length, 0))

const {
  isSaving,
  uploadResetKey,
  hasPendingUploads,
  onFilesSelected,
  onRemoveSelectedFile,
  onSave,
} = useComplementaryDocuments({
  saveSuccessMessage: t('entities.prospect.conformity.complementaryDocuments.saveSuccess'),
  saveErrorMessage: t('entities.prospect.conformity.complementaryDocuments.saveError'),
}, emit)

const { openDocumentsConsultDrawer } = useDocumentsConsultDrawerStore()

const onUploadFileDeleted = (deletedFile: UploadFile | UploadRawFile): void => {
  const rawFile = getRawFile(deletedFile)
  if (rawFile !== undefined) {
    onRemoveSelectedFile(rawFile)
  }
}
</script>
