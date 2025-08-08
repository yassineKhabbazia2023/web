<template>
  <div
    data-testid="pennylane-documents-widget"
    class="
      flex
      flex--direction-column
      height--100
    "
  >
    <PennylaneDocumentsHeader
      :lastSynchroDate="pennylaneLastSynchroDate"
      class="margin-bottom--2"
    />

    <POverlay
      v-if="apiCallStatus === APICallStatus.LOADING"
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
      />

      <PennylaneDocumentsNoResult
        v-if="pennylaneDocuments.length === 0"
        :isError="apiCallStatus === APICallStatus.ERROR"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PennylaneDocumentsHeader from './components/pennylane-documents-header/pennylane-documents-header.vue'
import PennylaneDocumentsNoResult from './components/pennylane-documents-no-result/pennylane-documents-no-result.vue'
import PennylaneDocumentsWithResult from './components/pennylane-documents-with-result/pennylane-documents-with-result.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { PennylaneDocument } from '@pulse/common/types'
import { PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'
import { logger } from '@pulse/core'

const pennylaneDocuments = ref<PennylaneDocument[]>([])
const pennylaneLastSynchroDate = ref<Date>()
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
const selectedEntityStore = useSelectedEntityStore()

onMounted(async () => {
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(selectedEntityStore.selectedEntityAccountNumber)

    pennylaneDocuments.value = documentQueryResult.items
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
