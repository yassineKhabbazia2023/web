import { describe, it, expect } from 'vitest'
import { getBreadcrumbItems }
  from '@/modules/common/helpers/folderHelper'
import type { Folder, FolderProperties } from '@/models/Folder'

const folders = [
  {
    iconName: 'accountingRoot',
    id: 135393636,
    children: [
      {
        iconName: 'deposit',
        id: 135393637,
        children: [
          {
            id: 135393649,
            children: [],
            name: 'A classer',
            parent: {
              id: 135393637
            },
            permissions: [
              'CAN_DELETE_FILES',
              'CAN_UPLOAD_FILES',
              'CAN_CREATE_FOLDER',
              'CAN_MOVE_INTO_FOLDER'
            ],
            properties: {
              syncStatus: 'PENDING_SYNC',
              folderDescription:
                "Ce dossier regroupe l'ensemble des documents."
            } as FolderProperties,
            serviceId: 'service-id-compta'
          } as Folder
        ] as Folder[],
        name: 'Dépôt',
        parent: {
          id: 135393636
        },
        permissions: [
          'CAN_DELETE_FILES',
          'CAN_UPLOAD_FILES',
          'CAN_CREATE_FOLDER',
          'CAN_MOVE_INTO_FOLDER'
        ],
        properties: {} as FolderProperties,
        serviceId: 'service-id-compta'
      } as Folder,
      {
        iconName: 'deposit',
        id: 135393638,
        children: [] as Folder[],
        name: 'KPMG',
        parent: {
          id: 135393636
        },
        permissions: [],
        properties: {
          folderDescription:
            "Ici, veuillez trouver l'ensemble des documents déposés par votre expert KPMG."
        } as FolderProperties,
        serviceId: 'service-id-compta'
      } as Folder
    ],
    name: 'Comptabilité',
    parent: {
      id: 0
    },
    permissions: ['CAN_DELETE_FILES'],
    properties: {
      syncStatus: 'ERROR_SYNC',
      folderDescription:
        "Déposez et retrouvez ici l'ensemble des documents échangés avec votre expert comptable.",
      tracingName: 'Accounting'
    },
    serviceId: 'service-id-compta'
  } as Folder
] as Folder[]

describe('folderHelper', () => {
  it('should return the breadcrumb items', () => {
    const res = getBreadcrumbItems(folders, 135393649)

    const resExpectd = [{
      pId: 135393636,
      pText: 'Comptabilité'
    },
    {
      pId: 135393637,
      pText: 'Dépôt'
    },
    {
      pId: 135393649,
      pText: 'A classer'
    }]

    expect(res).toStrictEqual(resExpectd)
  })
  it('should return empty when empty param', () => {
    const res = getBreadcrumbItems([], 135393649)

    expect(res).toStrictEqual([])
  })
})
