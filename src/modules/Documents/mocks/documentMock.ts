import type { Document } from '@/models/Document'
export const documentMock = {
  id: '1234567890',
  name: 'My Document.pdf',
  content: {
    href: 'https://example.com/my-document.pdf',
  },
  preview: {
    href: 'https://example.com/my-document-preview.png',
  },
  updatedBy: 'John Doe',
  updated: '2023-10-11T08:09:26Z',
  type: 'PDF',
  size: 1024,
  comments: [],
  isUploadedInGedLoop: true,
  folder: {
    id: 1,
    path: ['My Documents'],
  },
  created: '2023-10-10T12:00:00Z',
  createdBy: 'Jane Doe',
  account: {
    id: '1234567890',
    name: 'My Account',
  },
  properties: {
    syncStatus: 'In Sync',
    HasSubscribedToVault: 'Yes',
  },
  lifecycleStatus: 'Active',
  paymentStatus: 'Paid',
  source: {
    id: 1,
    code: 'MY_SOURCE',
    libelle: 'My Source',
  },
  piaStatus: {
    technicalName: 'PIA_ACTIVE',
    labelFr: 'Actif',
    labelEn: 'Active',
    date: '2023-10-11T08:09:26Z',
  },
  permissions: ['READ', 'WRITE'],
  isNew: false,
}
export const documentsMock : Document[] = [
  {
    id: '1',
    name: 'My Document',
    content: {
      href: 'https://example.com/document.pdf',
    },
    preview: {
      href: 'https://example.com/document_preview.png',
    },
    updatedBy: 'John Doe',
    updated: '2023-08-04T12:00:00Z',
    type: 'PDF',
    size: 1024,
    comments: [],
    isUploadedInGedLoop: null,
    folder: {
      id: 1,
      path: ['My Documents'],
    },
    created: '2023-08-04T12:00:00Z',
    createdBy: 'John Doe',
    account: {
      id: '1234567890',
      name: 'Acme Corporation',
    },
    properties: {
      syncStatus: 'SYNCED',
      HasSubscribedToVault: '',
    },
    lifecycleStatus: 'ACTIVE',
    paymentStatus: null,
    source: {
      id: 1,
      code: 'MY_SOURCE',
      libelle: 'My Source',
    },
    piaStatus: {
      technicalName: 'Collectable',
      labelFr: 'nouveau',
      labelEn: 'new',
      date: '2023-08-04T12:00:00Z',
    },
    permissions: ['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'],
    isNew: false,
  },
]
export const documentsMockWithError : Document[] = [
  {
    id: '1',
    name: 'My Document ceritifé',
    content: {
      href: 'https://example.com/document.pdf',
    },
    preview: {
      href: 'https://example.com/document_preview.png',
    },
    updatedBy: 'John Doe',
    updated: '2023-08-04T12:00:00Z',
    type: 'PDF',
    size: 1024,
    comments: [],
    isUploadedInGedLoop: null,
    folder: {
      id: 1,
      path: ['My Documents'],
    },
    created: '2023-08-04T12:00:00Z',
    createdBy: 'John Doe',
    account: {
      id: '1234567890',
      name: 'Acme Corporation',
    },
    properties: {
      syncStatus: 'SYNCED',
      HasSubscribedToVault: 'Oui',
    },
    lifecycleStatus: 'ACTIVE',
    paymentStatus: null,
    source: {
      id: 1,
      code: 'MY_SOURCE',
      libelle: 'My Source',
    },
    piaStatus: {
      technicalName: 'Collectable',
      labelFr: 'nouveau',
      labelEn: 'new',
      date: '2023-08-04T12:00:00Z',
    },
    permissions: ['CAN_RENAME_DOCUMENT', 'CAN_MOVE_DOCUMENT'],
    isNew: false,
  },
  {
    id: '2',
    name: 'My Document ceritifé',
    content: {
      href: 'https://example.com/document.pdf',
    },
    preview: {
      href: 'https://example.com/document_preview.png',
    },
    updatedBy: 'John Doe',
    updated: '2023-08-04T12:00:00Z',
    type: 'PDF',
    size: 1024,
    comments: [],
    isUploadedInGedLoop: null,
    folder: {
      id: 1,
      path: ['My Documents'],
    },
    created: '2023-08-04T12:00:00Z',
    createdBy: 'John Doe',
    account: {
      id: '1234567890',
      name: 'Acme Corporation',
    },
    properties: {
      syncStatus: 'SYNCED',
      HasSubscribedToVault: 'Non',
    },
    lifecycleStatus: 'ACTIVE',
    paymentStatus: null,
    source: {
      id: 1,
      code: 'MY_SOURCE',
      libelle: 'My Source',
    },
    piaStatus: {
      technicalName: 'Collectable',
      labelFr: 'nouveau',
      labelEn: 'new',
      date: '2023-08-04T12:00:00Z',
    },
    permissions: ['CAN_RENAME_DOCUMENT'],
    isNew: false,
  },
]
