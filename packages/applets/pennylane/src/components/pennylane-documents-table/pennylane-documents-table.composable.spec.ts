import { ref } from 'vue'
import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import type { PennylaneDocument } from '@pulse/common/types'
import { usePennylaneDocumentsTableSelection } from './pennylane-documents-table.composable'

const pennylaneDocumentsMock = [
  getMockedPennylaneDocument({ id: 1 }),
  getMockedPennylaneDocument({ id: 2 }),
]

function setupSelection(selectedDocumentIds: PennylaneDocument['id'][], pennylaneDocuments = pennylaneDocumentsMock) {
  const selectedDocumentIdsRef = ref(selectedDocumentIds)

  return {
    selectedDocumentIds: selectedDocumentIdsRef,
    ...usePennylaneDocumentsTableSelection(pennylaneDocuments, selectedDocumentIdsRef),
  }
}

describe('pennylane-documents-table.composable', () => {
  describe('areAllDocumentsSelected and isDocumentsSelectionIndeterminate', () => {
    it.each([
      { selectedDocumentIds: [], expectedAllSelected: false, expectedIndeterminate: false },
      { selectedDocumentIds: [1], expectedAllSelected: false, expectedIndeterminate: true },
      { selectedDocumentIds: [1, 2], expectedAllSelected: true, expectedIndeterminate: false },
    ])('should compute selection state when $selectedDocumentIds are selected', ({
      selectedDocumentIds,
      expectedAllSelected,
      expectedIndeterminate,
    }) => {
      const { areAllDocumentsSelected, isDocumentsSelectionIndeterminate } = setupSelection(selectedDocumentIds)

      expect(areAllDocumentsSelected.value).toBe(expectedAllSelected)
      expect(isDocumentsSelectionIndeterminate.value).toBe(expectedIndeterminate)
    })

    it('should not consider all documents selected when there is no document', () => {
      const { areAllDocumentsSelected, isDocumentsSelectionIndeterminate } = setupSelection([], [])

      expect(areAllDocumentsSelected.value).toBe(false)
      expect(isDocumentsSelectionIndeterminate.value).toBe(false)
    })
  })

  describe('isDocumentSelected', () => {
    it('should return whether the document is selected', () => {
      const { isDocumentSelected } = setupSelection([1])

      expect(isDocumentSelected(1)).toBe(true)
      expect(isDocumentSelected(2)).toBe(false)
    })
  })

  describe('toggleSelectedDocument', () => {
    it('should select an unselected document', () => {
      const { selectedDocumentIds, toggleSelectedDocument } = setupSelection([1])

      toggleSelectedDocument(2)

      expect(selectedDocumentIds.value).toStrictEqual([1, 2])
    })

    it('should unselect a selected document', () => {
      const { selectedDocumentIds, toggleSelectedDocument } = setupSelection([1, 2])

      toggleSelectedDocument(1)

      expect(selectedDocumentIds.value).toStrictEqual([2])
    })
  })

  describe('toggleAllSelectedDocuments', () => {
    it.each([
      { selectedDocumentIds: [], expectedSelectedDocumentIds: [1, 2] },
      { selectedDocumentIds: [1], expectedSelectedDocumentIds: [1, 2] },
      { selectedDocumentIds: [1, 2], expectedSelectedDocumentIds: [] },
    ])('should update selection to $expectedSelectedDocumentIds when $selectedDocumentIds are selected', ({
      selectedDocumentIds,
      expectedSelectedDocumentIds,
    }) => {
      const { selectedDocumentIds: selectedDocumentIdsRef, toggleAllSelectedDocuments } = setupSelection(selectedDocumentIds)

      toggleAllSelectedDocuments()

      expect(selectedDocumentIdsRef.value).toStrictEqual(expectedSelectedDocumentIds)
    })
  })
})
