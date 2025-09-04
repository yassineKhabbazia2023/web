<template>
  <PennylaneDocumentsWrapper
    :accountId
    :accountNumber
    :apiCallStatus
    :accountName
    :displayMode="PennylaneDocumentWrapperDisplayMode.IN_TABLE"
    :pennylaneDocuments
    amplitudeLocalisation="ged_doc_rydge_conseil"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import PennylaneDocumentsWrapper from '@pennylane/components/pennylane-documents-wrapper/pennylane-documents-wrapper.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'
import { logger } from '@pulse/core'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'

const selectedEntityStore = useSelectedEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
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
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch(e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
})
</script>
