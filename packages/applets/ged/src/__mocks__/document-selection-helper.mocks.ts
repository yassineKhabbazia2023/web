import type { Document } from '@ged/models/Document'
import { Permissions } from '@ged/models/Permissions'

const mocks: Record<string, Document[]> = {
  docs1: [{
    id: '1',
    name: 'Document 1',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_DELETE_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false,
  }, {
    id: '2',
    name: 'Document 2',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_DELETE_DOCUMENT],
    isNew: false,
  }, {
    id: '3',
    name: 'Document 3',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_MOVE_DOCUMENT],
    isNew: false },
  ],
  docs2: [{
    id: '1',
    name: 'Document 1',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_DELETE_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false,
  }, {
    id: '2',
    name: 'Document 2',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_DELETE_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false },
  ],
  docs3: [{
    id: '1',
    name: 'Document 1',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_RENAME_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false,
  }, {
    id: '2',
    name: 'Document 2',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_RENAME_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false },
  ],
  docs4: [{
    id: '1',
    name: 'Document 1',
    content: {
      href: '',
    },
    preview: {
      href: '',
    },
    updatedBy: 'User 1',
    updated: '2023-10-18',
    type: 'Type 1',
    size: 1000,
    comments: [],
    isUploadedInGedLoop: true,
    folder: {
      id: 1,
      path: [],
    },
    created: '2023-10-17',
    createdBy: 'User 2',
    account: {
      id: '',
      name: '',
    },
    properties: {
      syncStatus: '',
    },
    lifecycleStatus: 'Status 1',
    paymentStatus: null,
    source: {
      id: 1,
      code: '',
      libelle: '',
    },
    piaStatus: {
      technicalName: '',
      labelFr: '',
      labelEn: '',
      date: '',
    },
    permissions: [Permissions.CAN_RENAME_DOCUMENT, Permissions.CAN_MOVE_DOCUMENT],
    isNew: false },
  ],
}

export default mocks
