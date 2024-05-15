import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type { Document } from '@/models/Document'
import type { DocumentsListProps } from '../DocumentsListTypes'

export function useDocumentsDragAndDrop(
  selectedFolders: Ref<Document[]>,
  currentService: Ref<DocumentsListProps['currentService']>,
  validDraggedFilesCount: Ref<number>,
) {
  function getDocumentsRowElements() {
    return document.getElementsByClassName('document-row')
  }

  onMounted(() => {
    const documentRowElements = getDocumentsRowElements()
    Array.from(documentRowElements).forEach((element) => {
      ;(element as HTMLElement).addEventListener('dragstart', handleDragStart)
      ;(element as HTMLElement).addEventListener('dragend', handleDragEnd)
    })
  })

  onBeforeUnmount(() => {
    const documentRowElements = getDocumentsRowElements()
    Array.from(documentRowElements).forEach((element) => {
      ;(element as HTMLElement).removeEventListener('dragstart', handleDragStart)
      ;(element as HTMLElement).removeEventListener('dragend', handleDragEnd)
    })
  })

  const documentsToMove = computed(() =>
    selectedFolders.value.filter((folder) => {
      return folder.permissions.includes('CAN_MOVE_DOCUMENT')
    }),
  )

  function handleDragStart(event: DragEvent): void {
    if (!event.dataTransfer) return

    validDraggedFilesCount.value = documentsToMove.value.length

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
    const newElement = getNewSelectedFolder(previousDocuments, newDocuments)

    if (newElement) {
      addDragAndDropAttributes(newElement)
    } else {
      const removedElement = getRemovedSelectedFolder(
        previousDocuments,
        newDocuments,
      )
      if (!removedElement) return
      removeDragAndDropAttributes(removedElement)
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
    if (!element) return
    element.setAttribute('draggable', 'true')
  }

  function removeDragAndDropAttributes(documentItem: Document) {
    const element = getDocumentRowNode(documentItem)
    if (!element) return
    element.removeAttribute('draggable')
  }

  function getDocumentRowNode(documentItem: Document): Element | null {
    return document
      .getElementsByClassName(`document-row ${documentItem.id}`)
      .item(0)
  }

  function handleDragEnd() {
    document.body.classList.remove('grabbing')
  }
}
