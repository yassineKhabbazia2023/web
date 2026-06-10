<template>
  <div
    v-if="isLoading"
    class="
      documents-list__loader
      flex
      flex--justify-content-center
    "
    data-testid="documents-list-loader"
  >
    <PLoader pType="primary" />
  </div>
  <PDocumentsList
    v-else
    :pData="documentsListItems"
    :pVisibleColumns="visibleColumns"
    pStripe
    @download="downloadDocument"
  />
</template>

<script setup lang="ts">
import { PDocumentsList, PLoader } from '@pulse/styleguide/components'
import { useDocumentsList } from './documents-list.composable'
import type { DocumentsListProps } from './documents-list.types'

defineProps<DocumentsListProps>()

const { documentsListItems, isLoading, downloadDocument } = useDocumentsList()
</script>
