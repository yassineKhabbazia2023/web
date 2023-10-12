<template>
  <div>
    {{ text }}
    <DocumentsList
      v-if="documents"
      :documentsListWithTableStructure="documents"
      @on-sort-change="handleSortChange"
    />
    <PLoader
      v-else
      type="gradient"
      size="42"
    />
  </div>
</template>

<script setup lang="ts">
// eslint-disable vitest/require-hook

import { ref, watch } from 'vue'
import DocumentsList from './sections/DocumentsList'
import { fetchFolderDocuments } from '@/services/Documents'
import { DocumentsProps } from './DocumentsTypes'
import type { DocumentsWithTableStructure } from '@/models/Document'
import { PLoader } from '@kpmg/styleguide'

const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const componentSortQueryField = ref('')
const componentStartQueryField = ref(0)
const componentLimitQueryField = ref(10)
// eslint-disable-next-line vitest/require-hook
watch(() => props.selectedFolder, async () => {

  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity
  )
})

const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    componentStartQueryField.value,
    componentLimitQueryField.value,
    componentSortQueryField.value
  )
}

const text = 'Documents list section'

</script>
