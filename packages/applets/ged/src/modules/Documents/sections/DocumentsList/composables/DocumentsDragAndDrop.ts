import { computed, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type { Document } from '@ged/models/Document'
import type { DocumentsListProps } from '../DocumentsListTypes'
import { trackDocumentMoveFlowStart } from '@ged/services/tracking/tracking.service'
import { TriggerSource } from '@ged/services/tracking/tracking.types'

export function useDocumentsDragAndDrop(
  selectedFolders: Ref<Document[]>,
  currentService: Ref<DocumentsListProps['currentService']>,
  draggedDocuments: Ref<Document[]>,
) {
  function getDocumentsRowElements() {
    return document.getElementsByClassName('document-row')
  }

  function bindDragProperties() {
    // Reason of no-undef disabling :

    // https://github.com/typescript-eslint/typescript-eslint/blob/1cf9243/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors

    const documentRowElements = getDocumentsRowElements() as HTMLCollectionOf<HTMLElement>
    Array.from(documentRowElements).forEach((element: HTMLElement) => {
      element.addEventListener('dragstart', handleDragStart)
      element.addEventListener('dragend', handleDragEnd)
    })
  }

  onBeforeUnmount(() => {
    // Read above for the no-undef disabling reason

    const documentRowElements = getDocumentsRowElements() as HTMLCollectionOf<HTMLElement>
    Array.from(documentRowElements).forEach((element) => {
      element.removeEventListener('dragstart', handleDragStart)
      element.removeEventListener('dragend', handleDragEnd)
    })
  })

  const documentsToMove = computed(() =>
    selectedFolders.value.filter((folder) => {
      return folder.permissions.includes('CAN_MOVE_DOCUMENT')
    }),
  )

  // If you're searching for the handling of the drop event,
  // check in the Treeview folder as this is where documents are dropped
  function handleDragStart(event: DragEvent): void {
    if (!event.dataTransfer) {
      return
    }

    draggedDocuments.value = documentsToMove.value

    const ghost = document.getElementsByClassName('document-drag-ghost').item(0)
    event.dataTransfer.setDragImage(ghost!, 0, 0)

    event.dataTransfer.setData(
      'application/json+document',
      JSON.stringify(documentsToMove.value),
    )
    event.dataTransfer.setData(String(currentService.value), 'serviceId')
    trackDocumentMoveFlowStart(TriggerSource.DRAG_AND_DROP)
  }

  // There's nothing to handle Drag & Drop in the Table component nativaly (Element Plus)
  // This is why i'm doing attribute binding based on rows classes of selectedFolders
  watch(selectedFolders, (newDocuments, previousDocuments) => {
    if (hasLengthDifferenceMoreThanOne(newDocuments, previousDocuments)) {
      addDragAndDropAttributesMultiple(newDocuments)
      bindDragProperties()
    } else {
      const newElement = getNewSelectedFolder(previousDocuments, newDocuments)
      if (newElement) {
        addDragAndDropAttributes(newElement)
        bindDragProperties()
      } else {
        const removedElement = getRemovedSelectedFolder(
          previousDocuments,
          newDocuments,
        )
        if (!removedElement) {
          return
        }
        removeDragAndDropAttributes(removedElement)
      }
    }
  })

  // I'm using these functions to only browse the concerned node.
  // Otherwise i would have to go through every nodes of the selected rows in the DOM.
  function getNewSelectedFolder(
    previousDocuemnts: Document[],
    currentDocuments: Document[],
  ) {
    return currentDocuments.find((item) => !previousDocuemnts.includes(item))
  }

  function getRemovedSelectedFolder(
    previousDocuemnts: Document[],
    currentDocuments: Document[],
  ) {
    return previousDocuemnts.find((item) => !currentDocuments.includes(item))
  }

  function addDragAndDropAttributes(documentItem: Document) {
    const element = getDocumentRowNode(documentItem)
    if (!element) {
      return
    }
    element.setAttribute('draggable', 'true')
  }

  function addDragAndDropAttributesMultiple(documents: Document[]) {
    documents.forEach((document) => addDragAndDropAttributes(document))
  }

  function removeDragAndDropAttributes(documentItem: Document) {
    const element = getDocumentRowNode(documentItem)
    if (!element) {
      return
    }
    element.removeAttribute('draggable')
  }

  function getDocumentRowNode(documentItem: Document): Element | null {
    return document
      .getElementsByClassName(`document-row ${documentItem.id}`)
      .item(0)
  }

  function handleDragEnd() {
    draggedDocuments.value = []
    document.body.classList.remove('grabbing')
  }

  // When I am watching selected documents, I use the newly selected document to bind drag attributes.
  // However, there is also the case when I click the "select all documents" button.
  // This function is useful to know that I added multiple documents in a single click and that I need to bind
  // multiple drag events instead of just one.
  function hasLengthDifferenceMoreThanOne(firstArray: any[], secondArray: any[]) {
    return Math.abs(firstArray.length - secondArray.length) > 1
  }
}
