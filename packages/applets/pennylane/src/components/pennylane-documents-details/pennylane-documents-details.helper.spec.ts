import { getMockedFormattedPennylaneDocument } from '@pennylane/__mocks__/formatted-pennylane-document.mocks'
import { getDisplayData } from './pennylane-documents-details.helper'
import type { PennylaneDocumentsDetailsLabels } from './pennylane-documents-details.type'

describe('pennylane-documents-details.helper', () => {
  describe('getFormattedPennylaneDocuments', () => {
    it('should return formatted documents with the correct path prefix', () => {
      const pennylaneDocument = getMockedFormattedPennylaneDocument()
      const expectedDisplayData = [{
        label: 'Nom du document',
        value: 'Header.png',
      },
      {
        label: 'Emplacement du document',
        value: '/Dossier permanent/00 - Publications',
      },
      {
        label: 'Date de dépôt',
        value: '04/08/2025',
      },
      {
        label: 'Dernière modification',
        value: '04/08/2025',
      }]

      const labels: PennylaneDocumentsDetailsLabels = {
        name: 'Nom du document',
        path: 'Emplacement du document',
        createdAt: 'Date de dépôt',
        updatedAt: 'Dernière modification',
      }
      const displayData = getDisplayData(labels, pennylaneDocument)

      expect(displayData).toStrictEqual(expectedDisplayData)
    })
  })
})
