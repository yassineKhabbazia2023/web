import type { PennylaneDocumentsTableFieldKeys, PennylaneDocumentsTableActionName } from './pennylane-documents-table.type'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

import { getPennylaneDocumentsFieldsColumns, getToolboxElements } from './pennylane-documents-table.helper'

describe('pennylane-documents-result.helper', () => {
  describe('getPennylaneDocumentsFieldsColumns', () => {
    it('should return columns properly', () => {
      const expectedColumns = [{
        'label': 'Nom',
        'prop': 'name',
        'sortable': true,
      }, {
        'label': 'Emplacement',
        'prop': 'path',
        'sortable': true,
      }, {
        'label': 'Déposé le',
        'prop': 'updatedAt',
        'sortable': true,
      }, {
        'label': '',
        'prop': 'actions',
        'sortable': false,
      }]

      const labels: Record<PennylaneDocumentsTableFieldKeys, string> = {
        name: 'Nom',
        path: 'Emplacement',
        updatedAt: 'Déposé le',
        actions: '',
      }
      const columns = getPennylaneDocumentsFieldsColumns(labels)

      expect(columns).toStrictEqual(expectedColumns)
    })
  })
  describe('getToolboxElements', () => {
    it('should return toolbox elements properly', () => {
      const expectedToolboxElements: PToolboxItemProps<PennylaneDocumentsTableActionName>[] = [{
        pValue: 'Télécharger',
        pActionName: 'download',
      }]

      const toolboxElements = getToolboxElements({
        downloadLabel: 'Télécharger',
      })

      expect(toolboxElements).toStrictEqual(expectedToolboxElements)
    })
  })
})
