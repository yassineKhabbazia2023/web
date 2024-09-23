import type { Folder } from '@ged/models/Folder'

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
                    id: 135393649,
                  },
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
                    folderDescription:
                      "Ce dossier regroupe l'ensemble des documents.",
                    tracingName: 'tracing-name',
                  },
                  serviceId: 'service-id-compta',
                },
              ],
              name: 'A classer',
              parent: {
                id: 135393637,
              },
              permissions: [
                'CAN_DELETE_FILES',
                'CAN_UPLOAD_FILES',
                'CAN_CREATE_FOLDER',
                'CAN_MOVE_INTO_FOLDER',
              ],
              properties: {
                syncStatus: 'PENDING_SYNC',
                folderDescription:
                  "Ce dossier regroupe l'ensemble des documents.",
                tracingName: 'tracing-name',
              },
              serviceId: 'service-id-compta',
            },
          ],
          name: 'Dépôt',
          parent: {
            id: 135393636,
          },
          permissions: [
            'CAN_DELETE_FILES',
            'CAN_UPLOAD_FILES',
            'CAN_CREATE_FOLDER',
            'CAN_MOVE_INTO_FOLDER',
          ],
          properties: {
            syncStatus: 'PENDING_SYNC',
          },
          serviceId: 'service-id-compta',
        },
        {
          iconName: 'deposit',
          id: 135393638,
          children: [],
          name: 'KPMG',
          parent: {
            id: 135393636,
          },
          permissions: [],
          properties: {
            folderDescription:
              "Ici, veuillez trouver l'ensemble des documents déposés par votre expert KPMG.",
            tracingName: 'tracing-name',
            syncStatus: 'PENDING_SYNC',
          },
          serviceId: 'service-id-compta',
        },
      ],
      name: 'Comptabilité',
      parent: {
        id: 0,
      },
      permissions: ['CAN_DELETE_FILES'],
      properties: {
        syncStatus: 'ERROR_SYNC',
        folderDescription:
          "Déposez et retrouvez ici l'ensemble des documents échangés avec votre expert comptable.",
        tracingName: 'Accounting',
      },
      serviceId: 'service-id-compta',
    },
  ],
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
              children: [],
              name: 'A classer',
              parent: {
                id: 135393666,
              },
              permissions: [
                'CAN_DELETE_FILES',
                'CAN_UPLOAD_FILES',
                'CAN_CREATE_FOLDER',
                'CAN_MOVE_INTO_FOLDER',
              ],
              properties: {
                folderDescription:
                  "Ce dossier regroupe l'ensemble des documents sociaux à reclasser ultérieurement.",
                syncStatus: 'PENDING_SYNC',
              },
              serviceId: 'service-id-gs',
            },
          ],
          name: 'Dépôt',
          parent: {
            id: 135393664,
          },
          permissions: [
            'CAN_DELETE_FILES',
            'CAN_UPLOAD_FILES',
            'CAN_CREATE_FOLDER',
            'CAN_MOVE_INTO_FOLDER',
          ],
          properties: {
            syncStatus: 'PENDING_SYNC',
          },
          serviceId: 'service-id-gs',
        },
        {
          iconName: 'deposit',
          id: 135393665,
          children: [
            {
              id: 135393725,
              children: [],
              name: 'Dossier Annuel',
              parent: {
                id: 135393665,
              },
              permissions: [],
              properties: {
                folderDescription:
                  "Ici, veuillez trouver l'ensemble des bulletins de salaire.",
                syncStatus: 'PENDING_SYNC',
              },
              serviceId: 'service-id-gs',
            },
          ],
          name: 'KPMG',
          parent: {
            id: 135393664,
          },
          permissions: [],
          properties: {
            syncStatus: 'PENDING_SYNC',
          },
          serviceId: 'service-id-gs',
        },
      ],
      name: 'Gestion Sociale',
      parent: {
        id: 0,
      },
      permissions: ['CAN_DELETE_FILES'],
      properties: {
        folderDescription:
          "Déposez et retrouvez ici l'ensemble des documents échangés.",
        tracingName: 'Human resources management',
        syncStatus: 'PENDING_SYNC',
      },
      serviceId: 'service-id-gs',
    },
  ],
]

export const newFolderData: Folder = {
  id: 1212124,
  children: [],
  name: 'NEW',
  parent: {
    id: 11111111,
  },
  permissions: [
    'CAN_DELETE_FILES',
  ],
  properties: {
    folderDescription:
      "Ce dossier regroupe l'ensemble des documents.",
    syncStatus: 'PENDING_SYNC',
  },
  serviceId: 'service-id-compta',
}
