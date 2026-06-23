import type { RequestHandler } from 'msw'
import { delay, http, HttpResponse } from 'msw'

// Dev mock handlers — add your selective API mocks here.
// These handlers only activate when VITE_DEV_MOCKS=true.
// Any request NOT matched here passes through to real APIs.
//
// Usage:
//   1. Uncomment the `http` and `HttpResponse` import above
//   2. Add handlers to the array below
//   3. Run `npm run dev:mocks` in the app workspace
//
// Example:
//   http.get('*/contact/me', () => {
//     return HttpResponse.json({ id: 1, firstName: 'Dev', lastName: 'User' })
//   }),
//
// You can also import existing mock factories:
//   import { getCurrentUserResponseMock } from '@pulse/common/mocks'
//
//   http.get('*/contact/me', () => {
//     return HttpResponse.json(getCurrentUserResponseMock())
//   }),

const prospect = {
  'accountId': 602,
  'accountNumber': '2025546345',
  'accountType': 'PROSPECT',
  'legalName': 'Boulangerie Beau Prospect',
  'isSignatory': false,
}

// Switch this flag to test the different states of the beneficiaries section:
// - 'inProgress': some beneficiaries are incomplete (save flow)
// - 'readyToComplete': all beneficiaries complete, section not yet marked ("Valider les bénéficiaires..." button)
// - 'completed': section marked as completed, the whole beneficiaries UX is locked
type BeneficiariesScenario = 'inProgress' | 'readyToComplete' | 'completed'
const BENEFICIARIES_SCENARIO = 'inProgress' as BeneficiariesScenario

const beneficiariesResponse = {
  'prospectId': 602,
  'hasBeenCompleted': false,
  'beneficiaries': [
    {
      'id': '148cf2c3-ccfa-44d0-addd-1b46a4a6f2f9',
      'firstName': 'Jeanne',
      'lastName': 'Dupont',
      'isComplete': true,
      'documentType': 'CNI',
      'documents': [
        {
          'id': 'doc-guid-1',
          'fileOrder': 1,
          'fileName': 'CNI_DUPONT_recto.jpg',
          'contentType': 'image/jpeg',
          'uploadedAt': '2026-06-09T11:00:00Z',
          'uploadedBy': 'test@rydge.fr',
        },
        {
          'id': 'doc-guid-2',
          'fileOrder': 2,
          'fileName': 'CNI_DUPONT_verso.jpg',
          'contentType': 'image/jpeg',
          'uploadedAt': '2026-06-09T11:00:00Z',
          'uploadedBy': 'test@rydge.fr',
        },
      ],
    },
    {
      'id': 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      'firstName': 'Marc',
      'lastName': 'Martin',
      'isComplete': false,
      'documentType': 'CNI',
      'documents': [
        {
          'id': 'doc-guid-3',
          'fileOrder': 1,
          'fileName': 'CNI_MARTIN_recto.jpg',
          'contentType': 'image/jpeg',
          'uploadedAt': '2026-06-10T09:30:00Z',
          'uploadedBy': 'test@rydge.fr',
        },
      ],
    },
    {
      'id': 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      'firstName': 'Sofia',
      'lastName': 'Bernard',
      'isComplete': false,
      'documentType': null,
      'documents': [],
    },
  ],
}

const getBeneficiariesResponse = () => {
  if (BENEFICIARIES_SCENARIO === 'inProgress') {
    return beneficiariesResponse
  }
  const completedDocuments = beneficiariesResponse.beneficiaries[0].documents
  return {
    ...beneficiariesResponse,
    hasBeenCompleted: BENEFICIARIES_SCENARIO === 'completed',
    beneficiaries: beneficiariesResponse.beneficiaries.map((beneficiary) => ({
      ...beneficiary,
      isComplete: true,
      documentType: 'CNI',
      documents: beneficiary.documents.length > 0 ? beneficiary.documents : completedDocuments,
    })),
  }
}

// Switch this flag to test the different states of the conformity documents section:
// - 'inProgress': some required documents are still missing (save flow)
// - 'readyToComplete': all required documents uploaded, section not yet validated
// - 'completed': section validated, the whole conformity documents UX is locked
type ConformityDocumentsScenario = 'inProgress' | 'readyToComplete' | 'completed'
const CONFORMITY_DOCUMENTS_SCENARIO = 'completed' as ConformityDocumentsScenario

const conformityDocumentsResponse = {
  'status': 'InProgress',
  'isComplete': false,
  'requiredDocs': [
    {
      'type': 'KBIS',
      'label': 'Extrait Kbis',
      'fileUploadedId': 42,
      'fileName': 'kbis_acme.pdf',
      'uploadedAt': '2026-06-10T14:32:00Z',
      'depositedBy': { 'firstName': 'Marie', 'lastName': 'Dupont' },
    },
    {
      'type': 'DECLARATION_BENEFICIAIRES_EFFECTIFS',
      'label': 'Déclaration des bénéficiaires effectifs',
      'fileUploadedId': null,
      'fileName': null,
      'uploadedAt': null,
      'depositedBy': null,
    },
  ],
}

const getConformityDocumentsResponse = () => {
  if (CONFORMITY_DOCUMENTS_SCENARIO === 'inProgress') {
    return conformityDocumentsResponse
  }
  return {
    'status': CONFORMITY_DOCUMENTS_SCENARIO === 'completed' ? 'Done' : 'InProgress',
    'isComplete': CONFORMITY_DOCUMENTS_SCENARIO === 'completed',
    'requiredDocs': conformityDocumentsResponse.requiredDocs.map((requiredDoc) => ({
      ...requiredDoc,
      'fileUploadedId': requiredDoc.fileUploadedId ?? 99,
      'fileName': requiredDoc.fileName ?? 'declaration_acme.pdf',
      'uploadedAt': requiredDoc.uploadedAt ?? '2026-06-11T09:00:00Z',
      'depositedBy': requiredDoc.depositedBy ?? { 'firstName': 'Jean', 'lastName': 'Martin' },
    })),
  }
}

export const devMockHandlers: RequestHandler[] = [
  // Add your handlers here
  http.get('*/connect/api/accounts/602/summary', () => {
    return HttpResponse.json(prospect)
  }),

  http.get('*/gtw/prospect/api/prospects/check-eligibility', () => {
    return HttpResponse.error()
  }),

  http.get('*/prospect/api/prospects/:accountId/beneficiaries', () => {
    return HttpResponse.json(getBeneficiariesResponse())
  }),

  http.post('*/prospect/api/prospects/:accountId/beneficiaries/:beneficiaryId/identity-documents', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 201 })
  }),

  http.patch('*/prospect/api/prospects/:accountId/beneficiaries', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.get('*/prospect/api/prospects/:prospectId/documents', () => {
    return HttpResponse.json(getConformityDocumentsResponse())
  }),

  http.post('*/prospect/api/prospects/:prospectId/documents', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 201 })
  }),

  // Shared endpoint: also deletes beneficiaries identity documents
  http.delete('*/prospect/api/prospects/:prospectId/documents/:documentId', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.put('*/prospect/api/prospects/:prospectId/justificatifs/complete', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.get('*/prospect/api/prospects/:prospectId/documents/:documentId/content', () => {
    return new HttpResponse(new Blob(['mock document content'], { type: 'application/pdf' }), {
      headers: { 'Content-Type': 'application/pdf' },
    })
  }),
]
