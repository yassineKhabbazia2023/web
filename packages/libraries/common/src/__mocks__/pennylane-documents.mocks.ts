import {
  getMockedPennylaneDocument,
  getMockedPennylaneDocumentsQueryResult,
} from './pennylane.mocks'

export const mockedPennylaneDocuments = [
  getMockedPennylaneDocument({ id: 1, name: 'Facture_2024_001.pdf', path: '/Comptabilité/Factures' }),
  getMockedPennylaneDocument({ id: 2, name: 'Facture_2024_002.pdf', path: '/Comptabilité/Factures' }),
  getMockedPennylaneDocument({ id: 3, name: 'Bulletin_salaire_janvier.pdf', path: '/RH/Paie' }),
]

export const mockedPennylaneDocumentsQueryResult = getMockedPennylaneDocumentsQueryResult({
  items: mockedPennylaneDocuments,
  totalItems: mockedPennylaneDocuments.length,
})
