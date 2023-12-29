import { Folder, FolderProperties } from '@/models/Folder'

export const foldersData: Folder[][] = [
  [
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
              children: [
                {
                  id: 11111111,
                  children: [],
                  name: 'MOVABLE',
                  parent: {
                    id: 135393649
                  },
                  permissions: [
                    'CAN_DELETE_FILES',
                    'CAN_UPLOAD_FILES',
                    'CAN_CREATE_FOLDER',
                    'CAN_MOVE_INTO_FOLDER',
                    'CAN_MOVE_FOLDER'
                  ],
                  properties: {
                    syncStatus: 'PENDING_SYNC',
                    folderDescription:
                      "Ce dossier regroupe l'ensemble des documents."
                  } as FolderProperties,
                  serviceId: 'service-id-compta'
                } as Folder
              ],
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
  ] as Folder[],
  [
    {
      iconName: 'socialRoot',
      id: 135393664,
      children: [
        {
          iconName: 'deposit',
          id: 135393666,
          children: [
            {
              id: 135393724,
              children: [] as Folder[],
              name: 'A classer',
              parent: {
                id: 135393666
              },
              permissions: [
                'CAN_DELETE_FILES',
                'CAN_UPLOAD_FILES',
                'CAN_CREATE_FOLDER',
                'CAN_MOVE_INTO_FOLDER'
              ],
              properties: {
                folderDescription:
                  "Ce dossier regroupe l'ensemble des documents sociaux à reclasser ultérieurement."
              } as FolderProperties,
              serviceId: 'service-id-gs'
            } as Folder
          ] as Folder[],
          name: 'Dépôt',
          parent: {
            id: 135393664
          },
          permissions: [
            'CAN_DELETE_FILES',
            'CAN_UPLOAD_FILES',
            'CAN_CREATE_FOLDER',
            'CAN_MOVE_INTO_FOLDER'
          ],
          properties: {} as FolderProperties,
          serviceId: 'service-id-gs'
        } as Folder,
        {
          iconName: 'deposit',
          id: 135393665,
          children: [
            {
              id: 135393725,
              children: [],
              name: 'Dossier Annuel',
              parent: {
                id: 135393665
              },
              permissions: [],
              properties: {
                folderDescription:
                  "Ici, veuillez trouver l'ensemble des bulletins de salaire."
              } as FolderProperties,
              serviceId: 'service-id-gs'
            } as Folder
          ] as Folder[],
          name: 'KPMG',
          parent: {
            id: 135393664
          },
          permissions: [],
          properties: {} as FolderProperties,
          serviceId: 'service-id-gs'
        } as Folder
      ] as Folder[],
      name: 'Gestion Sociale',
      parent: {
        id: 0
      },
      permissions: ['CAN_DELETE_FILES'],
      properties: {
        folderDescription:
          "Déposez et retrouvez ici l'ensemble des documents échangés.",
        tracingName: 'Human resources management'
      } as FolderProperties,
      serviceId: 'service-id-gs'
    } as Folder
  ] as Folder[]
]

export const newFolderData: Folder = {
  id: 1212124,
  children: [],
  name: 'NEW',
  parent: {
    id: 11111111
  },
  permissions: [
    'CAN_DELETE_FILES'
  ],
  properties: {
    folderDescription:
      "Ce dossier regroupe l'ensemble des documents."
  } as FolderProperties,
  serviceId: 'service-id-compta'
}
