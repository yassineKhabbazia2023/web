import { describe, expect, it } from 'vitest'
import { documentsMock, documentsMockWithOneCertified } from '@ged/__mocks__/documents.mocks'
import { getDocumentsTableStructureMock } from '@ged/__mocks__/documents-table-structure.mocks'
import { Document } from '@ged/models/Document'
import { documentListColumnNames } from '@ged/modules/Documents/constants/documents-list.const'
import {
  getRowAlignmentClass,
  getIsDraggedDocument,
  getStateClassWhenDragged,
  getTextClass,
  getRowClasses,
  getShouldOpenDrawer,
  getDocumentIndex,
} from './documents-list.manager'
import type { DocumentListTableColumn } from './documents-list.types'

import * as documentsListManager from './documents-list.manager'
import * as documentsHelper from '@ged/modules/Documents/helpers/documents.helper'

describe('documents list manager', () => {

  const getRowAlignmentClassTestTable = new Array(3)
  it.each([
    {
      index: 0,
      expectedResult: 'default',
    },
    {
      index: 1,
      expectedResult: 'default',
    },
    {
      index: 2,
      expectedResult: 'right',
    },
  ])('should return "$expectedResult" when the index is $index', ({ index, expectedResult }) => {
    const result = getRowAlignmentClass(index, getRowAlignmentClassTestTable)
    expect(result).toStrictEqual(expectedResult)
  })

  it.each([
    {
      document: documentsMockWithOneCertified[0],
      draggedDocuments: [documentsMockWithOneCertified[1]],
      expectedResult: false,
    },
    {
      document: documentsMockWithOneCertified[0],
      draggedDocuments: [documentsMockWithOneCertified[0], documentsMockWithOneCertified[1]],
      expectedResult: true,
    },
  ])(
    'should return $expectedResult when document e draggedDocuments list',
    ({ document, draggedDocuments, expectedResult }) => {
      const result = getIsDraggedDocument(document, draggedDocuments)
      expect(result).toBe(expectedResult)
    })

  it.each([
    { isDraggedDocument: false, isDragging: false, expectedResult: '' },
    { isDraggedDocument: false, isDragging: true, expectedResult: 'text-color--neutral-gray-500' },
    { isDraggedDocument: false, isDragging: false, expectedResult: '' },
    { isDraggedDocument: false, isDragging: true, expectedResult: 'text-color--neutral-gray-500' },
    { isDraggedDocument: true, isDragging: false, expectedResult: '' },
    { isDraggedDocument: true, isDragging: false, expectedResult: '' },
    { isDraggedDocument: true, isDragging: true, expectedResult: '' },
  ])(
    'should return $expectedResult when isDraggedDocument is $isDraggedDocument, isDragging is $isDragging, and isDocumentCertified is $isDocumentCertified',
    ({ isDraggedDocument, isDragging, expectedResult }) => {
      const result = getTextClass(isDraggedDocument, isDragging)
      expect(result).toBe(expectedResult)
    },
  )

  it.each([
    {
      isDraggedDocument: false,
      expectedResult: '',
    },
    {
      isDraggedDocument: true,
      expectedResult: 'p-table__row--active',
    },
  ])(
    'should retourn $expectedResult when document is a dragged documents and documents are being dragged',
    ({ isDraggedDocument, expectedResult }) => {
      const result = getStateClassWhenDragged(isDraggedDocument)
      expect(result).toBe(expectedResult)
    })

  describe('get row classes', () => {
    interface TestCasesType {
      description: string
      document: Document
      isDraggedDocument: boolean
      isDocumentCertified: boolean
      stateClassWhenDragged: ReturnType<typeof getStateClassWhenDragged>
      textClassWhenDragged: ReturnType<typeof getTextClass>
      draggedDocuments: Document[]
      isDragging: boolean
      expectedContains: Array<'document-row' | 'cursor-pointer' | 'p-table__row--active' | 'text-color--neutral-gray-500'>
      expectedNotContains: Array<'document-row' | 'cursor-pointer' | 'p-table__row--active' | 'text-color--neutral-gray-500'>,
    }

    const testCases: TestCasesType[] = [
      {
        description: 'No dragged document, not dragging, no certification',
        document: documentsMockWithOneCertified[0],
        isDraggedDocument: false,
        isDocumentCertified: false,
        stateClassWhenDragged: '',
        textClassWhenDragged: '',
        draggedDocuments: [],
        isDragging: false,
        expectedContains: ['document-row', 'cursor-pointer'],
        expectedNotContains: ['p-table__row--active', 'text-color--neutral-gray-500'],
      },
      {
        description: 'Document is dragged, dragging, and certified',
        document: documentsMockWithOneCertified[1],
        isDraggedDocument: true,
        isDocumentCertified: true,
        stateClassWhenDragged: 'p-table__row--active',
        textClassWhenDragged: 'text-color--neutral-gray-500',
        draggedDocuments: [documentsMockWithOneCertified[1]],
        isDragging: true,
        expectedContains: ['document-row', 'cursor-pointer', 'text-color--neutral-gray-500'],
        expectedNotContains: ['p-table__row--active'],
      },
      {
        description: 'Document is dragged, dragging, but not certified',
        document: documentsMockWithOneCertified[0],
        isDraggedDocument: true,
        isDocumentCertified: false,
        stateClassWhenDragged: 'p-table__row--active',
        textClassWhenDragged: '',
        draggedDocuments: [documentsMockWithOneCertified[0]],
        isDragging: true,
        expectedContains: ['document-row', 'cursor-pointer', 'p-table__row--active'],
        expectedNotContains: ['text-color--neutral-gray-500'],
      },
      {
        description: 'Document is not dragged, but dragging and certified',
        document: documentsMockWithOneCertified[1],
        isDraggedDocument: false,
        isDocumentCertified: true,
        stateClassWhenDragged: '',
        textClassWhenDragged: 'text-color--neutral-gray-500',
        draggedDocuments: [documentsMockWithOneCertified[0]],
        isDragging: true,
        expectedContains: ['document-row', 'cursor-pointer', 'text-color--neutral-gray-500'],
        expectedNotContains: ['p-table__row--active'],
      },
    ]
    it.each(testCases)(
      '$description',
      ({
        document,
        isDraggedDocument,
        isDocumentCertified,
        stateClassWhenDragged,
        textClassWhenDragged,
        draggedDocuments,
        isDragging,
        expectedContains,
        expectedNotContains,
      }) => {
        vi.spyOn(documentsHelper, 'getIsDocumentCertified').mockReturnValue(isDocumentCertified)
        vi.spyOn(documentsListManager, 'getIsDraggedDocument').mockReturnValue(isDraggedDocument)
        vi.spyOn(documentsListManager, 'getStateClassWhenDragged').mockReturnValue(stateClassWhenDragged)
        vi.spyOn(documentsListManager, 'getTextClass').mockReturnValue(textClassWhenDragged)

        const result = getRowClasses({
          document,
          draggedDocuments,
          isDragging,
        })

        expectedContains.forEach((expected) => {
          expect(result).toContain(expected)
        })
        expectedNotContains.forEach((notExpected) => {
          expect(result).not.toContain(notExpected)
        })

        vi.restoreAllMocks()
      },
    )
  })

  describe('get should open drawer', () => {
    it.each([
      {
        testCaseName: 'should return false when header don\'t have an existing column',
        tableStructureMock: getDocumentsTableStructureMock(),
        column: { label: 'not a column label from table structure' },
        expectedResult: false,
      },
      {
        testCaseName: 'should return false when header label is "Actions"',
        tableStructureMock: getDocumentsTableStructureMock(),
        column: { label: documentListColumnNames.ACTIONS_DROPDOWN },
        expectedResult: false,
      },
      {
        testCaseName: 'should return false when column has a falsy value',
        tableStructureMock: getDocumentsTableStructureMock(),
        column: null,
        expectedResult: false,
      },
      {
        testCaseName: 'should return true label exists in headers and is not "Actions"',
        tableStructureMock: getDocumentsTableStructureMock(),
        column: { label: getDocumentsTableStructureMock()[0].columnName },
        expectedResult: true,
      },
    ])('$testCaseName', ({ tableStructureMock, column, expectedResult }) => {
      const result = getShouldOpenDrawer(tableStructureMock, column as DocumentListTableColumn)
      expect(result).toBe(expectedResult)
    })
  })

  describe('get document index', () => {
    it.each([
      {
        document: documentsMock[0],
        expectedIndex: 0,
      },
      {
        document: documentsMock[1],
        expectedIndex: 1,
      },
      {
        document: documentsMock[100],
        expectedIndex: -1,
      },
    ])('returns the index of a document', ({ document, expectedIndex }) => {
      const result = getDocumentIndex(document, documentsMock)
      expect(result).toBe(expectedIndex)
    })
  })
})
