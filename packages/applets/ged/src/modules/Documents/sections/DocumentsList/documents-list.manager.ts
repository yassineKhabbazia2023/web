import type { Document } from '@ged/models/Document'
import { getIsDocumentCertified } from '@ged/modules/Documents/helpers/documents.helper'
import { GetRowClassNameParameters } from './documents-list.types'

export function getRowAlignmentClass(index: number, referenceTable: Array<any>) {
  return index + 1 === referenceTable.length ? 'right' : 'default'
}

export function getIsDraggedDocument(document: Document, draggedDocuments: Document[]) {
  if(getIsDocumentCertified(document)) {
    return false
  }

  return draggedDocuments.find((documentLine) => documentLine.id === document.id) !== undefined
}

export function getStateClassWhenDragged(isDraggedDocument: boolean) {
  if (isDraggedDocument) {
    return 'p-table__row--active'
  }

  return ''
}

export function getTextClass(isDraggedDocument: boolean, isDragging: boolean) {
  if (isDragging && !isDraggedDocument) {
    return 'text-color--neutral-gray-500'
  }

  return ''
}

export function getRowClasses({ document, draggedDocuments, isDragging }: GetRowClassNameParameters) {
  const isDraggedDocument = getIsDraggedDocument(document, draggedDocuments)
  const stateClassWhenDragged = getStateClassWhenDragged(isDraggedDocument)
  const textClass = getTextClass(isDraggedDocument, isDragging)

  return `
    document-row
    ${document.id}
    ${stateClassWhenDragged}
    ${textClass}
    cursor-pointer
    `
}
