import { DocumentsWithTableStructure } from '@/models/Document'

export const documentsResponsePayload: DocumentsWithTableStructure = {
  documentsPage: {
    items: [
      {
        id: '1234567890',
        name: 'My Document',
        content: {
          href: 'https://example.com/my-document.pdf'
        },
        preview: {
          href: 'https://example.com/my-document-preview.png'
        },
        updatedBy: 'John Doe',
        updated: '2023-10-11T08:09:26Z',
        type: 'PDF',
        size: 1024,
        comments: [],
        isUploadedInGedLoop: true,
        folder: {
          id: 1,
          path: ['My Documents']
        },
        created: '2023-10-10T12:00:00Z',
        createdBy: 'Jane Doe',
        account: {
          id: '1234567890',
          name: 'My Account'
        },
        properties: {
          syncStatus: 'In Sync',
          HasSubscribedToVault: 'Yes'
        },
        lifecycleStatus: 'Active',
        paymentStatus: 'Paid',
        source: {
          id: 1,
          code: 'MY_SOURCE',
          libelle: 'My Source'
        },
        piaStatus: {
          technicalName: 'PIA_ACTIVE',
          labelFr: 'Actif',
          labelEn: 'Active',
          date: '2023-10-11T08:09:26Z'
        },
        permissions: ['READ', 'WRITE'],
        isNew: false
      }
    ]
  },
  documentHeaders: [
    {
      columnName: 'Nom du document',
      relatedProperty: 'name',
      fieldType: 'DocumentName',
      nestedPropertyName: null,
      ColumnOrder: 1
    },
    {
      columnName: '',
      relatedProperty: 'properties',
      fieldType: 'Tag',
      nestedPropertyName: null,
      ColumnOrder: 2
    },
    {
      columnName: 'Déposé le',
      relatedProperty: 'created',
      fieldType: 'Text',
      nestedPropertyName: null,
      ColumnOrder: 3
    },
    {
      columnName: 'Statut',
      relatedProperty: 'piaStatus',
      fieldType: 'Tag',
      nestedPropertyName: null,
      ColumnOrder: 4
    },
    {
      columnName: 'Actions',
      relatedProperty: 'permissions',
      fieldType: 'ActionGroup',
      nestedPropertyName: null,
      ColumnOrder: 5
    }
  ]
}

export const documentsResponsePayloadMoreThanOneDoc: DocumentsWithTableStructure = {
  documentsPage: {
    items: [
      {
        id: '1234567890',
        name: 'My Document',
        content: {
          href: 'https://example.com/my-document.pdf'
        },
        preview: {
          href: 'https://example.com/my-document-preview.png'
        },
        updatedBy: 'John Doe',
        updated: '2023-10-11T08:09:26Z',
        type: 'PDF',
        size: 1024,
        comments: [],
        isUploadedInGedLoop: true,
        folder: {
          id: 1,
          path: ['My Documents']
        },
        created: '2023-10-10T12:00:00Z',
        createdBy: 'Jane Doe',
        account: {
          id: '1234567890',
          name: 'My Account'
        },
        properties: {
          syncStatus: 'In Sync',
          HasSubscribedToVault: 'Yes'
        },
        lifecycleStatus: 'Active',
        paymentStatus: 'Paid',
        source: {
          id: 1,
          code: 'MY_SOURCE',
          libelle: 'My Source'
        },
        piaStatus: {
          technicalName: 'PIA_ACTIVE',
          labelFr: 'Actif',
          labelEn: 'Active',
          date: '2023-10-11T08:09:26Z'
        },
        permissions: ['READ', 'WRITE'],
        isNew: false
      },
      {
        id: '1234567890',
        name: 'My Document',
        content: {
          href: 'https://example.com/my-document.pdf'
        },
        preview: {
          href: 'https://example.com/my-document-preview.png'
        },
        updatedBy: 'John Doe',
        updated: '2023-10-11T08:09:26Z',
        type: 'PDF',
        size: 1024,
        comments: [],
        isUploadedInGedLoop: true,
        folder: {
          id: 1,
          path: ['My Documents']
        },
        created: '2023-10-10T12:00:00Z',
        createdBy: 'Jane Doe',
        account: {
          id: '1234567890',
          name: 'My Account'
        },
        properties: {
          syncStatus: 'In Sync',
          HasSubscribedToVault: 'Yes'
        },
        lifecycleStatus: 'Active',
        paymentStatus: 'Paid',
        source: {
          id: 1,
          code: 'MY_SOURCE',
          libelle: 'My Source'
        },
        piaStatus: {
          technicalName: 'PIA_ACTIVE',
          labelFr: 'Actif',
          labelEn: 'Active',
          date: '2023-10-11T08:09:26Z'
        },
        permissions: ['READ', 'WRITE'],
        isNew: false
      }
    ]
  },
  documentHeaders: [
    {
      columnName: 'Nom du document',
      relatedProperty: 'name',
      fieldType: 'DocumentName',
      nestedPropertyName: null,
      ColumnOrder: 1
    },
    {
      columnName: '',
      relatedProperty: 'properties',
      fieldType: 'Tag',
      nestedPropertyName: null,
      ColumnOrder: 2
    },
    {
      columnName: 'Déposé le',
      relatedProperty: 'created',
      fieldType: 'Text',
      nestedPropertyName: null,
      ColumnOrder: 3
    },
    {
      columnName: 'Statut',
      relatedProperty: 'piaStatus',
      fieldType: 'Tag',
      nestedPropertyName: null,
      ColumnOrder: 4
    },
    {
      columnName: 'Actions',
      relatedProperty: 'permissions',
      fieldType: 'ActionGroup',
      nestedPropertyName: null,
      ColumnOrder: 5
    }
  ]
}
