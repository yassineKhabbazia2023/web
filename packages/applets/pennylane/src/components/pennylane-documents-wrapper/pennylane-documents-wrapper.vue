<template>
  <div
    class="
      flex
      flex--direction-column
    "
  >
    <PennylaneDocumentsViewer
      v-if="hasOpenedPennylaneDocumentsViewer === true"
      :isOpened="pennylaneViewerDocument !== undefined"
      :accountNumber="accountNumber"
      :accountId="accountId"
      :pennylaneDocument="pennylaneViewerDocument"
      @update:is-opened="onUpdateViewIsOpened"
    />
    <POverlay
      v-if="apiCallStatus === APICallStatus.LOADING"
      pIsVignette
    >
      <div
        class="margin-y--12"
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>
    </POverlay>

    <template v-if="apiCallStatus !== APICallStatus.LOADING">
      <template
        v-if="pennylaneDocuments.length > 0 || isSearchActive === true"
      >
        <PennylaneDocumentsWithResult
          v-if="displayMode === PennylaneDocumentWrapperDisplayMode.IN_LIST"
          :pennylaneDocuments
          :accountNumber
          :accountId
          class="margin-top--4"
          @open-document="onOpenDocument"
        />
        <PennylaneDocumentsTable
          v-if="displayMode === PennylaneDocumentWrapperDisplayMode.IN_TABLE"
          v-model:selected-document-ids="selectedDocumentIds"
          :pennylaneDocuments
          :accountNumber
          :accountId
          class="margin-top--4"
          @open-document="onOpenDocument"
        />
      </template>
      <PennylaneDocumentsNoResult
        v-if="pennylaneDocuments.length === 0 && isSearchActive === false"
        class="margin-top--6"
        :isError="apiCallStatus === APICallStatus.ERROR"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PennylaneDocumentsNoResult from '@pennylane/components/pennylane-documents-no-result/pennylane-documents-no-result.vue'
import PennylaneDocumentsWithResult from '@pennylane/components/pennylane-documents-with-result/pennylane-documents-with-result.vue'
import PennylaneDocumentsTable from '@pennylane/components/pennylane-documents-table/pennylane-documents-table.vue'
import PennylaneDocumentsViewer from '@pennylane/components/pennylane-documents-viewer/pennylane-documents-viewer.vue'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import type { PennylaneDocument } from '@pulse/common/types'
import { PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { PennylaneDocumentWrapperProps } from './pennylane-documents-wrapper.type'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'

const props = withDefaults(defineProps<PennylaneDocumentWrapperProps>(), {
  isSearchActive: false,
})
const selectedDocumentIds = defineModel<PennylaneDocument['id'][]>('selectedDocumentIds', { default: () => [] })

const pennylaneViewerDocument = ref<FormattedPennylaneDocument>()
const hasOpenedPennylaneDocumentsViewer = ref<boolean>()

function onOpenDocument(pennylaneDocument: FormattedPennylaneDocument) {
  hasOpenedPennylaneDocumentsViewer.value = true
  pennylaneViewerDocument.value = pennylaneDocument

  const eventProperty = {
    document_consultation_localisation: props.amplitudeLocalisation,
  }
  AmplitudeService.track('Document Consulted', eventProperty)
}

function onUpdateViewIsOpened(isOpened: boolean) {
  if (isOpened === false) {
    pennylaneViewerDocument.value = undefined
  }
}
</script>
