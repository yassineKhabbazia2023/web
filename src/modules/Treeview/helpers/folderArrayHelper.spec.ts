import { Folder, FolderProperties } from '@/models/Folder'
import {
  findFolderDeepById,
  findCurrentServiceFolder,
  appendChildFolder,
  renameFolder,
  sortFolderByName,
  deleteFolder
} from './folderArrayHelper'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import { describe, it, expect } from 'vitest'

describe('folderArrayHelper.spec', () => {
  it('should get the folder from the data source when findFolderDeepById is called', () => {
    // to prevent the update of the data source
    const data = JSON.parse(JSON.stringify(foldersData[0]))
    const folderId = 135393649

    const folder = findFolderDeepById(data, folderId)

    expect(folder?.id).toStrictEqual(folderId)
  })

  it('should return a folder based on its service id when findCurrentServiceFolder is called',
    () => {
      const data = JSON.parse(JSON.stringify(foldersData))
      const serviceId = 'service-id-compta'

      // eslint-disable-next-line vitest/no-conditional-tests, vitest/no-conditional-in-test
      const folder = findCurrentServiceFolder(data, serviceId) ?? []

      expect(folder).toHaveLength(1)

      expect(folder[0].name).toStrictEqual('Comptabilité')
    })

  it('should add a new folder when appendChildFolder is called', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const parentId = 135393637

    const newFolder = {

      id: 1111111111,
      children: [],
      name: 'NewFolder',
      parent: {
        id: parentId
      },
      permissions: [],
      properties: {
        syncStatus: '',
        folderDescription: ''
      } as FolderProperties,
      serviceId: 'service-id-compta'
    } as Folder

    const serviceId = 'service-id-compta'
    const added = appendChildFolder(data, parentId, newFolder, serviceId)

    expect(added).toBeTruthy()
  })

  it(
    'should not add a new folder when  parent folder dose not exists',
    () => {
      const data = JSON.parse(JSON.stringify(foldersData))
      const parentId = 11111000

      const newFolder = {

        id: 1111111111,
        children: [],
        name: 'NewFolder',
        parent: {
          id: parentId
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      } as Folder

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
    const folderUpdatedData = {

      id: 1111111111,
      children: [],
      name: 'NewFolder',
      parent: {
        id: 1234
      },
      permissions: [],
      properties: {
        syncStatus: '',
        folderDescription: ''
      } as FolderProperties,
      serviceId: 'service-id-compta'
    } as Folder

    const renamed = renameFolder(data, serviceId, folderUpdatedData)
    expect(renamed).toBeFalsy()
  })

  it('should not rename folder when renameFolder is called and the folder dose not exists', () => {
    const data = JSON.parse(JSON.stringify(foldersData))
    const serviceId = 'service-id-compta'
    const folderUpdatedData = {

      id: 1111111111,
      children: [],
      name: 'NewFolder',
      parent: {
        id: 1234
      },
      permissions: [],
      properties: {
        syncStatus: '',
        folderDescription: ''
      } as FolderProperties,
      serviceId: 'service-id-compta'
    } as Folder

    const renamed = renameFolder(data, serviceId, folderUpdatedData)
    expect(renamed).toBeFalsy()
  })

  it('should sort folders based on their names when sortFolderByName is called', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const folderIdToSort = 135393637
    const serviceId = 'service-id-compta'

    const beforeSort = [
      ...source[0][0].children[0].children,
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      }
    ]

    source[0][0].children[0].children = beforeSort

    const sorted = sortFolderByName(source, serviceId, folderIdToSort)

    expect(sorted).toBeTruthy()
    expect(source[0][0].children[0].children).toStrictEqual([
      {

        id: 135393649,
        children: [],
        name: 'A classer',
        parent: { id: 135393637 },
        permissions: [
          'CAN_DELETE_FILES',
          'CAN_UPLOAD_FILES',
          'CAN_CREATE_FOLDER',
          'CAN_MOVE_INTO_FOLDER'
        ],
        properties: {
          syncStatus: 'PENDING_SYNC',
          folderDescription: "Ce dossier regroupe l'ensemble des documents."
        },
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: { id: 135393637 },
        permissions: [],
        properties: { syncStatus: '', folderDescription: '' },
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: { id: 135393637 },
        permissions: [],
        properties: { syncStatus: '', folderDescription: '' },
        serviceId: 'service-id-compta'
      }
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
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      }
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(source, serviceId, parentFolderId, folderIdToDelete)

    expect(deleted).toBeTruthy()
    expect(source[0][0].children[0].children
      .some(folder => folder.id === folderIdToDelete)).toBeFalsy()
  })

  it('should delete folder when deleteFolder is called', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 135393637
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1111111112

    const beforeDelete = [
      ...source[0][0].children[0].children,
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      }
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete
    )

    expect(deleted).toBeTruthy()
    expect(
      source[0][0].children[0].children.some(
        (folder) => folder.id === folderIdToDelete
      )
    ).toBeFalsy()
  })

  it('should not delete folder when provided parentId dose not exists', () => {
    const source = JSON.parse(JSON.stringify(foldersData)) as Folder[][]
    const parentFolderId = 111111111
    const serviceId = 'service-id-compta'
    const folderIdToDelete = 1111111112

    const beforeDelete = [
      ...source[0][0].children[0].children,
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      }
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete
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
      {

        id: 1111111112,
        children: [],
        name: 'DEF',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      },
      {

        id: 1111111111,
        children: [],
        name: 'ABC',
        parent: {
          id: 135393637
        },
        permissions: [],
        properties: {
          syncStatus: '',
          folderDescription: ''
        } as FolderProperties,
        serviceId: 'service-id-compta'
      }
    ]

    source[0][0].children[0].children = beforeDelete

    const deleted = deleteFolder(
      source,
      serviceId,
      parentFolderId,
      folderIdToDelete
    )

    expect(deleted).toBeFalsy()
  })
})
