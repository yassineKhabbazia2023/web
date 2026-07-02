<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="t('entities.prospect.documentsConsultDrawer.title')"
    pSize="55%"
    @close-drawer-button="onClose"
  >
    <PAlert
      pType="information"
      class="margin-bottom--4"
    >
      {{ t('entities.prospect.documentsConsultDrawer.alert') }}
    </PAlert>
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
        data-testid="download-documents-drawer-button"
        @click="downloadDocuments"
      >
        <PIcon pName="download" />
        <span class="padding-left--2">{{ t('entities.prospect.documents.download') }}</span>
      </PButton>
    </div>
    <DocumentsList
      v-if="isOpen"
      v-model:selected-documents="selectedDocuments"
      :visibleColumns="visibleColumns"
      selectable
    />
    <template #footer>
      <PDrawerActions
        :pPrimaryCTA="{ pLabel: t('entities.prospect.documentsConsultDrawer.close') }"
        @click-primary-cta="onClose"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PButton, PDrawer, PDrawerActions, PIcon } from '@pulse/styleguide/components'
import DocumentsList from '../documents-list/documents-list.vue'
import { useDocumentsDownload } from '../documents-download/documents-download.composable'
import type { DocumentsConsultDrawerProps } from './documents-consult-drawer.types'

const { t } = useI18n()

withDefaults(
  defineProps<DocumentsConsultDrawerProps>(),
  { visibleColumns: () => ['name', 'depositedBy', 'depositDate', 'options'] },
)

const isOpen = defineModel<boolean>({ required: true })

const { selectedDocuments, isDownloading, downloadDocuments } = useDocumentsDownload()

// Overlay click and Escape close the drawer without calling onClose, so reset the
// selection on every close to avoid reopening with a stale one.
watch(isOpen, (opened) => {
  if (opened === false) {
    selectedDocuments.value = []
  }
})

const onClose = (): void => {
  isOpen.value = false
}
</script>
