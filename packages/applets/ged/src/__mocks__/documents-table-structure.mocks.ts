import type { DocumentsTableStructure } from '@ged/models/Document'

export function getDocumentsTableStructureMock(
  override: DocumentsTableStructure[] = [],
): DocumentsTableStructure[] {
  return [
    {
      columnName: 'Nom du document',
      relatedProperty: 'name',
      secondRelatedProperty: undefined,
      fieldType: 'DocumentName',
      nestedPropertyName: null,
      columnOrder: 1,
    },
    {
      columnName: 'Déposé le',
      relatedProperty: 'created',
      secondRelatedProperty: undefined,
      fieldType: 'Text',
      nestedPropertyName: null,
      columnOrder: 3,
    },
    {
      columnName: 'Statut',
      relatedProperty: 'piaStatus',
      secondRelatedProperty: undefined,
      fieldType: 'Tag',
      nestedPropertyName: null,
      columnOrder: 4,
    },
    {
      columnName: 'Actions',
      relatedProperty: 'permissions',
      secondRelatedProperty: undefined,
      fieldType: 'ActionGroup',
      nestedPropertyName: null,
      columnOrder: 5,
    },
    ...override,
  ]
}