import { describe, it, expect } from 'vitest'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import type { Folder } from '@ged/models/Folder'

import {
  findFolderDeepById,
  findCurrentServiceFolder,
  appendChildFolder,
  renameFolder,
  sortFolderByName,
  deleteFolder,
} from './folderArrayHelper'

describe('folderArrayHelper.spec', () => {
  it('should get the folder from the data source when findFolderDeepById is called', () => {
    // to prevent the update of the data source
    const data = JSON.parse(JSON.stringify(foldersData[0]))
    const folderId = 135393649

    const folder = findFolderDeepById(data, folderId)

    expect(folder?.id).toStrictEqual(folderId)
  })

  it.each([
    {
      serviceId: 'service-id-compta',
      expectedFolder: foldersData[0],
    },
    {
      serviceId: 'service-id-gs',
      expectedFolder: foldersData[1],
    },
    {
      serviceId: 'random striiiiiing',
      expectedFolder: undefined,
    },
  ])('should return a folder based on its service id when findCurrentServiceFolder is called',
    ({ serviceId, expectedFolder }) => {
      const data = JSON.parse(JSON.stringify(foldersData))


      const folder = findCurrentServiceFolder(data, serviceId)

      expect(folder).toStrictEqual(expectedFolder)
    })

  it('should add a new folder when appendChildFolder is called', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const parentId = 135393637

    const newFolder = getMockedFolder(parentId)

    const serviceId = 'service-id-compta'
    const added = appendChildFolder(data, parentId, newFolder, serviceId)

    expect(added).toBeTruthy()
  })

  it(
    'should not add a new folder when  parent folder dose not exists',
    () => {
      const data = JSON.parse(JSON.stringify(foldersData))
      const parentId = 11111000

      const newFolder = getMockedFolder(parentId)
      const serviceId = 'service-id-compta'
      const added = appendChildFolder(data, parentId, newFolder, serviceId)

      expect(added).toBeFalsy()
    })

  it('should rename folder when renameFolder is called', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const serviceId = 'service-id-compta'
    const folderUpdatedData = data[0][0].children[0]

    const renamed = renameFolder(data, serviceId, folderUpdatedData)
    expect(renamed).toBeTruthy()
  })

  it('should not rename folder when renameFolder is called and the folder dose not exists', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const serviceId = 'service-id-compta'
    const folderUpdatedData = getMockedFolder(1234)

    const renamed = renameFolder(data, serviceId, folderUpdatedData)
    expect(renamed).toBeFalsy()
  })

  it('should not rename folder when renameFolder is called and the folder dose not exists (2)', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const serviceId = 'service-id-compta'
    const folderUpdatedData = getMockedFolder(1234)

    const renamed = renameFolder(data, serviceId, folderUpdatedData)
    expect(renamed).toBeFalsy()
  })

  it('should sort folders based on their names when sortFolderByName is called', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const folderIdToSort = 135393637
    const serviceId = 'service-id-compta'

    const beforeSort = [
      ...source[0][0].children[0].children,
      getMockedFolder(135393637, 1111111112, 'DEF'),
      getMockedFolder(135393637, 1111111111, 'ABC'),
    ]

    source[0][0].children[0].children = beforeSort

    const sorted = sortFolderByName(source, serviceId, folderIdToSort)

    expect(sorted).toBeTruthy()
    expect(source[0][0].children[0].children).toStrictEqual([
      getMockedFolder(135393637, 135393649, 'A classer', {
        children: [
          getMockedFolder(135393649, 11111111, 'MOVABLE', {
            children: [],
            permissions: [
              'CAN_DELETE_FILES',
              'CAN_UPLOAD_FILES',
              'CAN_CREATE_FOLDER',
              'CAN_MOVE_INTO_FOLDER',
              'CAN_MOVE_FOLDER',
              'CAN_RENAME_FOLDER',
            ],
            properties: {
              syncStatus: 'PENDING_SYNC',
              folderDescription: "Ce dossier regroupe l'ensemble des documents.",
              tracingName: 'tracing-name',
            },
            serviceId: 'service-id-compta',
          }),
        ],
        permissions: [
          'CAN_DELETE_FILES',
          'CAN_UPLOAD_FILES',
          'CAN_CREATE_FOLDER',
          'CAN_MOVE_INTO_FOLDER',
        ],
        properties: {
          syncStatus: 'PENDING_SYNC',
          folderDescription: "Ce dossier regroupe l'ensemble des documents.",
          tracingName: 'tracing-name',
        },
      }),
      getMockedFolder(135393637, 1111111111, 'ABC'),
      getMockedFolder(135393637, 1111111112, 'DEF'),
    ])
  })

  it('should not sort folders when a non existing folder id is provided', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const folderIdToSort = 111111111
    const serviceId = 'service-id-compta'

    const sorted = sortFolderByName(source, serviceId, folderIdToSort)

    expect(sorted).toBeFalsy()
  })

  it('should delete folder when deleteFolder is called', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 135393637
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1111111112

    const beforeDelete = [
      ...source[0][0].children[0].children,
      getMockedFolder(135393637, 1111111112, 'DEF'),
      getMockedFolder(135393637, 1111111111, 'ABC'),
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(source, serviceId, parentFolderId, folderIdToDelete)

    expect(deleted).toBeTruthy()
    expect(source[0][0].children[0].children
      .some(folder => folder.id === folderIdToDelete)).toBeFalsy()
  })

  it('should delete folder when deleteFolder is called (3)', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 135393637
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1111111112

    const beforeDelete = [
      ...source[0][0].children[0].children,
      getMockedFolder(135393637, 1111111112, 'DEF'),
      getMockedFolder(135393637, 1111111111, 'ABC'),
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete,
    )

    expect(deleted).toBeTruthy()
    expect(
      source[0][0].children[0].children.some(
        (folder) => folder.id === folderIdToDelete,
      ),
    ).toBeFalsy()
  })

  it('should not delete folder when provided parentId dose not exists', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 111111111
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1111111112

    const beforeDelete = [
      ...source[0][0].children[0].children,
      getMockedFolder(135393637, 1111111112, 'DEF'),
      getMockedFolder(135393637, 1111111111, 'ABC'),
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete,
    )

    expect(deleted).toBeFalsy()
  })
  it('should not delete folder when provided folderId dose not exists', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 135393637
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1

    const beforeDelete = [
      ...source[0][0].children[0].children,
      getMockedFolder(135393637, 1111111112, 'DEF'),
      getMockedFolder(135393637, 1111111111, 'ABC'),
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete,
    )

    expect(deleted).toBeFalsy()
  })
})
