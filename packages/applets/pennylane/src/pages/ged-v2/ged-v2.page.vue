<template>
  <div class="flex flex--direction-column height--100">
    <PennylaneDocumentsWrapper
      :accountId
      :accountNumber
      :apiCallStatus
      :accountName
      :displayMode="PennylaneDocumentWrapperDisplayMode.IN_TABLE"
      :pennylaneDocuments
      amplitudeLocalisation="documents rydge conseil"
      class="flex--grow-1"
    />

    <PPagination
      v-if="totalDocuments > 0 && apiCallStatus === APICallStatus.SUCCESS"
      v-model:p-current-page="currentPage"
      v-model:p-page-size="currentPageSize"
      class="margin-x--6"
      :pTotal="totalDocuments"
      pShowTotalPageCounter
      :pPageSizes="PAGE_SIZES"
      pTestIdRoot="pennylane-ged-v2"
      pPageSizeSelectorSuffix=""
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PennylaneDocumentsWrapper from '@pennylane/components/pennylane-documents-wrapper/pennylane-documents-wrapper.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'
import { logger } from '@pulse/toolbox'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PPagination } from '@pulse/styleguide/components'
import { PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'

const currentEntityStore = useCurrentEntityStore()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
const totalDocuments = ref<number>(0)

const accountId = computed(() => currentEntityStore.currentEntityId ?? 0)
const accountName = computed(() => currentEntityStore.currentEntity?.legalName ?? '')
const accountNumber = computed(() => currentEntityStore.currentEntityAccountNumber)

const currentPage = ref(1)
const currentPageSize = ref(PAGE_SIZES[0])

const paginationLabel = computed(() => getPaginationLabel('sur', {
  currentPage: currentPage.value,
  limit: currentPageSize.value,
  data: pennylaneDocuments.value,
  totalItems: totalDocuments.value,
}))

const fetchDocuments = async () => {
  const pathPrefix = 'Pennylane'
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(
      accountNumber.value,
      accountId.value,
      currentPage.value,
      currentPageSize.value,
    )

    pennylaneDocuments.value = getFormattedPennylaneDocuments(documentQueryResult.items, pathPrefix)
    totalDocuments.value = documentQueryResult.totalItems
    currentPage.value = documentQueryResult.currentPage
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch (e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
}

watch([currentPage, currentPageSize], fetchDocuments)

onMounted(fetchDocuments)
</script>

