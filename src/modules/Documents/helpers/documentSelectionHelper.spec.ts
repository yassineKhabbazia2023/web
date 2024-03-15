import type { Document } from '@/models/Document'
import { describe, it, expect } from 'vitest'
import { getPermissionsFromDocuments } from './documentSelectionHelper'
import mock from './documentSelectionHelper.mock.json'

describe('getPermissionsFromDocuments', () => {
  it('should return an empty array when no documents are provided', () => {
    const documents: Document[] = []
    const permissions = getPermissionsFromDocuments(documents)
    expect(permissions).toHaveLength(0)
  })

  it('should return unique permissions from the provided documents', () => {
    const documents: Document[] = mock.docs1
    const permissions = getPermissionsFromDocuments(documents)
    expect(permissions).toStrictEqual(['CAN_DELETE_DOCUMENT', 'CAN_MOVE_DOCUMENT'])
  })

  it('should handle duplicate permissions in the documents', () => {
    const documents: Document[] = mock.docs2
    const permissions = getPermissionsFromDocuments(documents)
    expect(permissions).toStrictEqual(['CAN_DELETE_DOCUMENT', 'CAN_MOVE_DOCUMENT'])
  })
  it('should not show Can_rename permissions in the documents actionbar', () => {
    const documents: Document[] = [
      {
        id: '1',
        name: 'Document 1',
        content: { href: '' },
        preview: { href: '' },
        updatedBy: 'User 1',
        updated: '2023-10-18',
        type: 'Type 1',
        size: 1000,
        comments: [],
        isUploadedInGedLoop: true,
        folder: { id: 1, path: [] },
        created: '2023-10-17',
        createdBy: 'User 2',
        account: { id: '', name: '' },
        properties: { syncStatus: '', HasSubscribedToVault: '' },
        lifecycleStatus: 'Status 1',
        paymentStatus: null,
        source: { id: 1, code: '', libelle: '' },
        piaStatus: { technicalName: '', labelFr: '', labelEn: '', date: '' },
        permissions: ['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'],
        isNew: false,
      },
      {
        id: '2',
        name: 'Document 2',
        content: { href: '' },
        preview: { href: '' },
        updatedBy: 'User 1',
        updated: '2023-10-18',
        type: 'Type 1',
        size: 1000,
        comments: [],
        isUploadedInGedLoop: true,
        folder: { id: 1, path: [] },
        created: '2023-10-17',
        createdBy: 'User 2',
        account: { id: '', name: '' },
        properties: { syncStatus: '', HasSubscribedToVault: '' },
        lifecycleStatus: 'Status 1',
        paymentStatus: null,
        source: { id: 1, code: '', libelle: '' },
        piaStatus: { technicalName: '', labelFr: '', labelEn: '', date: '' },
        permissions: ['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'],
        isNew: false,
      },
    ]
    const permissions = getPermissionsFromDocuments(documents)
    expect(permissions).toStrictEqual(['CAN_MOVE_DOCUMENT'])
  })
  it('should  show Can_rename because documents length == 1', () => {
    const documents: Document[] = [
      {
        id: '1',
        name: 'Document 1',
        content: { href: '' },
        preview: { href: '' },
        updatedBy: 'User 1',
        updated: '2023-10-18',
        type: 'Type 1',
        size: 1000,
        comments: [],
        isUploadedInGedLoop: true,
        folder: { id: 1, path: [] },
        created: '2023-10-17',
        createdBy: 'User 2',
        account: { id: '', name: '' },
        properties: { syncStatus: '', HasSubscribedToVault: '' },
        lifecycleStatus: 'Status 1',
        paymentStatus: null,
        source: { id: 1, code: '', libelle: '' },
        piaStatus: { technicalName: '', labelFr: '', labelEn: '', date: '' },
        permissions: ['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'],
        isNew: false,
      },
    ]
    const permissions = getPermissionsFromDocuments(documents)
    expect(permissions).toStrictEqual(['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'])
  })
})
