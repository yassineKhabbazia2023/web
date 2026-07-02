<template>
  <div
    class="
      prospect-documents
      flex
      flex--direction-column
    "
  >
    <PEntityHeader
      v-if="currentEntity"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      :pAccountType="currentEntity.accountType"
      class="prospect-documents__header margin-bottom--4"
    />
    <section
      class="
        prospect-documents__content
        flex
        flex--direction-column
        padding--6
      "
    >
      <div
        class="
          prospect-documents__toolbar
          flex
          flex--align-items-center
          flex--justify-content-space-between
          margin-bottom--4
        "
      >
        <PTitle pTitle="Documents" />
      </div>
      <div
        class="
          flex
          flex--justify-content-flex-end
          margin-bottom--4
        "
      >
        <PButton
          pSize="small"
          :pLoading="isDownloading"
          data-testid="download-documents-button"
          @click="downloadDocuments"
        >
          <PIcon pName="download" />
          <span class="padding-left--2">{{ t('entities.prospect.documents.download') }}</span>
        </PButton>
      </div>
      <DocumentsList
        v-model:selected-documents="selectedDocuments"
        selectable
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PButton, PEntityHeader, PIcon, PTitle } from '@pulse/styleguide/components'
import DocumentsList from './documents-list/documents-list.vue'
import { useDocumentsDownload } from './documents-download/documents-download.composable'

const { t } = useI18n()

const { currentEntity } = storeToRefs(useCurrentEntityStore())

const { selectedDocuments, isDownloading, downloadDocuments } = useDocumentsDownload()
</script>

<style scoped lang="scss">
.prospect-documents {
  height: 100%;

  &__header {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
