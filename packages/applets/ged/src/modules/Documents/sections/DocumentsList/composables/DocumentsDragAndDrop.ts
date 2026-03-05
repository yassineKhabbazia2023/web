import { computed, ref, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type { Document } from '@ged/models/Document'
import type { DocumentsListProps } from '../documents-list.types'
import { Permissions } from '@ged/models/Permissions'

function getDocumentsRowElements() {
  return document.getElementsByClassName('document-row')
}

// When I am watching selected documents, I use the newly selected document to bind drag attributes.
// However, there is also the case when I click the "select all documents" button.
// This function is useful to know that I added multiple documents in a single click and that I need to bind
// multiple drag events instead of just one.
function hasLengthDifferenceMoreThanOne(firstArray: any[], secondArray: any[]) {
  return Math.abs(firstArray.length - secondArray.length) > 1
}

export function useDocumentsDragAndDrop(
  selectedFolders: Ref<Document[]>,
  currentService: Ref<DocumentsListProps['currentService']>,
  draggedDocuments: Ref<Document[]>,
) {

  function bindDragProperties() {
    const documentRowElements = getDocumentsRowElements() as HTMLCollectionOf<HTMLElement>
    Array.from(documentRowElements).forEach((element: HTMLElement) => {
      element.addEventListener('dragstart', handleDragStart)
      element.addEventListener('dragend', handleDragEnd)
    })
  }

  onBeforeUnmount(() => {
    const documentRowElements = getDocumentsRowElements() as HTMLCollectionOf<HTMLElement>
    Array.from(documentRowElements).forEach((element) => {
      element.removeEventListener('dragstart', handleDragStart)
      element.removeEventListener('dragend', handleDragEnd)
    })
  })

  const documentsToMove = computed(() =>
    selectedFolders.value.filter((folder) => {
      return folder.permissions.includes(Permissions.CAN_MOVE_DOCUMENT)
    }),
  )

  // If you're searching for the handling of the drop event,
  // check in the Treeview folder as this is where documents are dropped

  const isDragging = ref(false)

  function handleDragStart(event: DragEvent): void {
    if (!event.dataTransfer) {
      return
    }

    isDragging.value = true
    draggedDocuments.value = documentsToMove.value

    const ghost = document.getElementsByClassName('document-drag-ghost').item(0)
    event.dataTransfer.setDragImage(ghost!, 0, 0)

    event.dataTransfer.setData(
      'application/json+document',
      JSON.stringify(documentsToMove.value),
    )
    event.dataTransfer.setData(String(currentService.value), 'serviceId')
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
    isDragging.value = false
    draggedDocuments.value = []
    document.body.classList.remove('grabbing')
  }

  return {
    isDragging,
  }
}
