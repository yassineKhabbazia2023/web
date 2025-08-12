<template>
  <div
    data-testid="pennylane-documents-widget"
    class="
      flex
      flex--direction-column
      height--100
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
    <PennylaneDocumentsHeader
      :lastSynchroDate="pennylaneLastSynchroDate"
      class="margin-bottom--2"
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
      <PennylaneDocumentsWithResult
        v-if="pennylaneDocuments.length > 0"
        :pennylaneDocuments="pennylaneDocuments"
        class="margin-top--4"
        @open-document="onOpenDocument"
      />

      <PennylaneDocumentsNoResult
        v-if="pennylaneDocuments.length === 0"
        :isError="apiCallStatus === APICallStatus.ERROR"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import PennylaneDocumentsHeader from './components/pennylane-documents-header/pennylane-documents-header.vue'
import PennylaneDocumentsNoResult from './components/pennylane-documents-no-result/pennylane-documents-no-result.vue'
import PennylaneDocumentsWithResult from './components/pennylane-documents-with-result/pennylane-documents-with-result.vue'
import PennylaneDocumentsViewer from './components/pennylane-documents-viewer/pennylane-documents-viewer.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { PennylaneDocument } from '@pulse/common/types'
import { PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import { logger } from '@pulse/core'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { getFormattedPennylaneDocuments } from './pennylane-documents.helper'

const selectedEntityStore = useSelectedEntityStore()

const pennylaneDocuments = ref<PennylaneDocument[]>([])
const pennylaneLastSynchroDate = ref<Date>()
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
const pennylaneViewerDocument = ref<PennylaneDocument>()
const hasOpenedPennylaneDocumentsViewer = ref<boolean>()

function onOpenDocument(pennylaneDocument: PennylaneDocument) {
  hasOpenedPennylaneDocumentsViewer.value = true
  pennylaneViewerDocument.value = pennylaneDocument

  const eventProperty = {
    document_consultation_localisation: 'homepage',
  }
  AmplitudeService.track('Document Consulted', eventProperty)
}

function onUpdateViewIsOpened(isOpened: boolean) {
  if (isOpened === false) {
    pennylaneViewerDocument.value = undefined
  }
}

const accountNumber = computed(() => selectedEntityStore.selectedEntityAccountNumber)
const accountId = computed(() => selectedEntityStore.selectedEntityId ?? 0)

onMounted(async () => {
  const pathPrefix = 'Pennylane'
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(accountNumber.value, accountId.value)

    pennylaneDocuments.value = getFormattedPennylaneDocuments(documentQueryResult.items, pathPrefix)
    const lastSynchroDate = new Date(documentQueryResult.lastSynchroDate)
    if (lastSynchroDate.toString() !== 'Invalid Date') {
      // avoid invalid date (if lastSynchroDate is undefined for example)
      pennylaneLastSynchroDate.value = lastSynchroDate
    }
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch(e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
})
</script>
