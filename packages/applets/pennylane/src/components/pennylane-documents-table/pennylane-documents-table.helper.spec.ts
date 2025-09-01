import type { PennylaneDocumentsTableFieldKeys } from './pennylane-documents-table.type'

import { getPennylaneDocumentsFieldsColumns } from './pennylane-documents-table.helper'

describe('pennylane-documents-result.helper', () => {
  describe('getPennylaneDocumentsFieldsColumns', () => {
    it('should return columns properly', () => {
      const expectedColumns = [{
        'label': 'Nom',
        'prop': 'name',
        'sortable': true,
      },
      {
        'label': 'Emplacement',
        'prop': 'path',
        'sortable': true,
      },
      {
        'label': 'Déposé le',
        'prop': 'updatedAt',
        'sortable': true,
      }]

      const labels: Record<PennylaneDocumentsTableFieldKeys, string> = {
        name: 'Nom',
        path: 'Emplacement',
        updatedAt: 'Déposé le',
      }
      const columns = getPennylaneDocumentsFieldsColumns(labels)

      expect(columns).toStrictEqual(expectedColumns)
    })
  })
})
