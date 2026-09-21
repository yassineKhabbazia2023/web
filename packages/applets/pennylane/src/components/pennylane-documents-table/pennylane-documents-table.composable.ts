import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { PennylaneDocument } from '@pulse/common/types'

export function usePennylaneDocumentsTableSelection(
  pennylaneDocuments: MaybeRefOrGetter<PennylaneDocument[]>,
  selectedDocumentIds: Ref<PennylaneDocument['id'][]>,
) {
  const documentIds = computed(() => toValue(pennylaneDocuments).map((pennylaneDocument) => pennylaneDocument.id))

  const areAllDocumentsSelected = computed(() =>
    documentIds.value.length > 0
    && documentIds.value.every((documentId) => isDocumentSelected(documentId)),
  )

  const isDocumentsSelectionIndeterminate = computed(() =>
    areAllDocumentsSelected.value === false
    && documentIds.value.some((documentId) => isDocumentSelected(documentId)),
  )

  function isDocumentSelected(documentId: PennylaneDocument['id']) {
    return selectedDocumentIds.value.includes(documentId)
  }

  function toggleSelectedDocument(documentId: PennylaneDocument['id']) {
    selectedDocumentIds.value = isDocumentSelected(documentId)
      ? selectedDocumentIds.value.filter((selectedDocumentId) => selectedDocumentId !== documentId)
      : [...selectedDocumentIds.value, documentId]
  }

  function toggleAllSelectedDocuments() {
    selectedDocumentIds.value = areAllDocumentsSelected.value === true
      ? []
      : [...documentIds.value]
  }

  return {
    areAllDocumentsSelected,
    isDocumentsSelectionIndeterminate,
    isDocumentSelected,
    toggleSelectedDocument,
    toggleAllSelectedDocuments,
  }
}
