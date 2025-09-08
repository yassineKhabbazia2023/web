<template>
  <div>
    <PennylaneDocumentsHeader
      :lastSynchroDate="pennylaneLastSynchroDate"
      class="margin-bottom--2"
    />
    <PennylaneDocumentsWrapper
      data-testid="pennylane-documents-widget"
      class="height--100"
      :accountId
      :accountName
      :accountNumber
      :apiCallStatus
      :displayMode="PennylaneDocumentWrapperDisplayMode.IN_LIST"
      :pennylaneDocuments
      :pennylaneLastSynchroDate
      amplitudeLocalisation="homepage"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import PennylaneDocumentsHeader from '@pennylane/components/pennylane-documents-header/pennylane-documents-header.vue'
import PennylaneDocumentsWrapper from '@pennylane/components/pennylane-documents-wrapper/pennylane-documents-wrapper.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { logger } from '@pulse/core'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'

const selectedEntityStore = useSelectedEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const pennylaneLastSynchroDate = ref<Date>()
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)

const accountId = computed(() => selectedEntityStore.selectedEntityId ?? 0)
const accountName = computed(() => selectedEntityStore.selectedEntity?.legalName ?? '')
const accountNumber = computed(() => selectedEntityStore.selectedEntityAccountNumber)

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
  } catch (e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
})
</script>
