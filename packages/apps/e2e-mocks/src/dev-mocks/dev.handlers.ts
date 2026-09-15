import type { RequestHandler } from 'msw'
import { delay, http, HttpResponse } from 'msw'
import {
  accountReferentialInformationMock,
  referentialHubsMock,
  referentialOfficesMock,
} from '@pulse/entities/mocks'

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

const conformityDocumentsResponse = {
  'prospectId': 602,
  'supportingDocuments': [
    {
      'id': '3fa85f64-5717-4562-b3fc-2c963f66afa8',
      'documentType': 'KBIS',
      'fileName': 'KBIS_ACME.pdf',
      'contentType': 'application/pdf',
      'uploadedAt': '2026-06-10T14:32:00Z',
      'uploadedBy': 'marie.dupont@rydge.fr',
    },
    {
      'id': '7b92c1a8-5717-4562-b3fc-2c963f66afa9',
      'documentType': 'DECLARATION_BENEFICIAIRES_EFFECTIFS',
      'fileName': 'Beneficiaires.pdf',
      'contentType': 'application/pdf',
      'uploadedAt': '2026-06-11T09:00:00Z',
      'uploadedBy': 'marie.dupont@rydge.fr',
    },
    {
      'id': '8c93d2b9-6728-5673-c4gd-3d074g77bgb0',
      'documentType': 'AUTRES',
      'fileName': 'Contrat_location.pdf',
      'contentType': 'application/pdf',
      'uploadedAt': '2026-06-12T10:00:00Z',
      'uploadedBy': 'marie.dupont@rydge.fr',
    },
  ],
  'beneficiaryDocuments': [
    {
      'id': 'd4e5f6a7-b890-1234-cdef-567890abcdef',
      'beneficiaryId': '148cf2c3-ccfa-44d0-addd-1b46a4a6f2f9',
      'documentType': 'CNI',
      'fileOrder': 1,
      'fileName': 'CNI_recto.jpg',
      'contentType': 'image/jpeg',
      'uploadedAt': '2026-06-09T11:00:00Z',
      'uploadedBy': 'jean.martin@rydge.fr',
    },
    {
      'id': 'e5f6a7b8-9012-3456-def0-678901abcdef',
      'beneficiaryId': '148cf2c3-ccfa-44d0-addd-1b46a4a6f2f9',
      'documentType': 'CNI',
      'fileOrder': 2,
      'fileName': 'CNI_verso.jpg',
      'contentType': 'image/jpeg',
      'uploadedAt': '2026-06-09T11:00:00Z',
      'uploadedBy': 'jean.martin@rydge.fr',
    },
  ],
  'commercialProposal': {
    'id': '3fa85f64-5717-4562-b3fc-2c963f66afb0',
    'fileName': 'Proposition_Commerciale_ACME.pdf',
    'contentType': 'application/pdf',
    'uploadedAt': '2026-06-11T09:00:00Z',
    'uploadedBy': 'jean.martin@rydge.fr',
  },
  'engagementLetter': {
    'id': '3fa85f64-5717-4562-b3fc-2c963f66afb2',
    'fileName': 'Lettre_Mission_ACME.pdf',
    'contentType': 'application/pdf',
    'uploadedAt': '2026-06-11T09:00:00Z',
    'uploadedBy': 'jean.martin@rydge.fr',
  },
}

const supportingDocumentsResponse = {
  'documents': [
    { 'type': 'KBIS', 'documents': [{ 'id': 123, 'fileName': 'KBIS_ACME.pdf' }], 'maxFiles': 1 },
    { 'type': 'DECLARATION_BENEFICIAIRES_EFFECTIFS', 'documents': [{ 'id': 124, 'fileName': 'Beneficiaires.pdf' }], 'maxFiles': 1 },
    { 'type': 'STATUTS', 'documents': [], 'maxFiles': 2 },
    { 'type': 'DECLARATION_PREFECTURE', 'documents': [], 'maxFiles': 1 },
    { 'type': 'AUTRES', 'documents': [{ 'id': 200, 'fileName': 'Contrat_location.pdf' }], 'maxFiles': 10 },
  ],
}

const onboardingStepsResponse = [
  { 'id': 'CommercialProposal', 'status': 'Completed' },
  { 'id': 'EngagementLetter', 'status': 'InProgress' },
  { 'id': 'Beneficiary', 'status': BENEFICIARIES_SCENARIO === 'completed' ? 'Completed' : 'InProgress' },
  { 'id': 'SupportingDocuments', 'status': 'InProgress' },
]

// Switch this flag to test the different payment preference states (payment.vue):
// - 'notSelected': no method chosen yet — the SEPA configuration drawer and the "autre moyen" choice are offered
// - 'sepa': a SEPA mandate has already been configured
// - 'other': an alternative payment method has already been chosen
type PaymentPreferenceScenario = 'notSelected' | 'sepa' | 'other'
const PAYMENT_PREFERENCE_SCENARIO = 'notSelected' as PaymentPreferenceScenario

// Mutated at runtime by the mock signing page: the drawer's "Continue" reads the payment preference
// to decide if the mandate is signed, so clicking "Signer" in the iframe flips this to true and the
// next GET returns MANDATE_SEPA. Generating a new mandate (POST sepa) resets it to false.
let isMandateSignedInMock = false

const getPaymentPreferenceResponse = () => {
  if (isMandateSignedInMock) {
    return { paymentType: 'MANDATE_SEPA' }
  }
  switch (PAYMENT_PREFERENCE_SCENARIO) {
    case 'sepa':
      return { paymentType: 'MANDATE_SEPA' }
    case 'other':
      return { paymentType: 'OTHER' }
    default:
      return { paymentType: null }
  }
}

// #region demat mail collect (back not ready yet)

// Switch this flag to test the demat mail solicitation (banner + dialog):
// - 'eligibleB2c': B2C customer with no demat mail — banner and dialog are shown
// - 'eligibleB2bInternational': same, with the B2B International routing code
// - 'alreadyFilled': the demat mail is set — no solicitation at all
// - 'outOfScope': routing code out of the B2C / B2B International scope — no solicitation
type DematMailScenario = 'eligibleB2c' | 'eligibleB2bInternational' | 'alreadyFilled' | 'outOfScope'
const DEMAT_MAIL_SCENARIO = 'eligibleB2c' as DematMailScenario

interface DematMailScenarioData {
  email: string
  accountRoutingCode: string
  accountRoutingLabel: string
}

const DEMAT_MAIL_SCENARIOS: Record<DematMailScenario, DematMailScenarioData> = {
  eligibleB2c: { email: '', accountRoutingCode: '0-B2C', accountRoutingLabel: 'B2C' },
  eligibleB2bInternational: { email: '', accountRoutingCode: '0-B2BINT', accountRoutingLabel: 'B2B International' },
  alreadyFilled: { email: 'facture@winston-tapia.fr', accountRoutingCode: '0-B2C', accountRoutingLabel: 'B2C' },
  outOfScope: { email: '', accountRoutingCode: '0-B2B', accountRoutingLabel: 'B2B' },
}

// Full account payload, mirroring the real ITG response. Served by BOTH
// demat/api (the solicitation) and account/api (the Informations page) so the two
// always agree on the same account. Only `email` and `accountRoutingCode` drive
// the solicitation; every other field is here to fill the Informations form.
const getAccountResponse = (accountId: number) => ({
  accountId,
  accountGlobalUniqueId: '92add0c1-5805-4696-b5a7-eb5895c0c419',
  accountNumber: '2024664516',
  iconName: 'penny-icon',
  isActive: true,
  employeeCount: 268,
  commercialName: 'Winston Tapia',
  accounting: {
    fiscalExerciseStartDate: '2024-01-01T00:00:00',
    fiscalExerciseDuration: 12,
    accountingType: 'Engagement',
    fiscalSystem: 'BIC',
    taxationSystem: 'IR',
    activityType: 'PS',
    activityDescription: 'Prestation de services',
  },
  legal: {
    legalName: 'Winston Tapia',
    siren: '124902506',
    siret: '12490250636163',
    legalForm: 'Société par actions simplifiée à associé unique',
    legalFormCode: 'SASU',
    staffSizeRange: '<300',
    naf: [{ nafId: 1, nafCode: '01.11Z', nafLabel: 'Culture de céréales' }],
    creationDate: '2024-04-29T09:32:54.7566667',
  },
  vat: { system: 'CA3M', intra: 'FR90729184822', type: 'Encaissement' },
  address: [
    {
      addressId: 26,
      addressLine1: '27 Rue de la Convention',
      addressLine2: 'Bâtiment C, 3e étage',
      addressLine3: '',
      state: 'Île-de-France',
      zipCode: '75015',
      country: 'France',
      city: 'Paris',
      addressType: 'Delivery',
    },
    {
      addressId: 626,
      addressLine1: '27 Rue des Croisiers',
      state: 'Normandie',
      zipCode: '14000',
      country: 'France',
      city: 'Caen',
      addressType: 'Billing',
    },
  ],
  phone: [
    { phoneId: 26, phoneNumber: '6126757907', type: 'delivery' },
    { phoneId: 626, phoneNumber: '2329019582', type: 'billing' },
  ],
  hub: { hubId: 1, hubName: 'Aquitaine Nord' },
  deployment: {
    deploymentId: 26,
    deploymentDate: '2024-04-29T10:00:07.096666',
    status: 3,
  },
  createdBy: 'KPMGADMIN',
  accountType: 'client',
  turnover: 241996782.00,
  missionType: 'Tenue',
  officeId: 74,
  office: {
    officeId: 74,
    name: 'Albi',
    phoneNumber: '05 63 48 75 10',
    addressId: 2936,
    address: {
      addressId: 2936,
      addressLine1: "ZAC Les Portes d'Albi",
      zipCode: '81000',
      country: 'France',
      city: 'Albi',
      addressType: 'Office',
      latitude: 43.920250,
      longitude: 2.113660,
    },
  },
  accountLegalFormLabel: 'Site de E-Commerce',
  accountElectronicAddressId: 'Liste à définir',
  // Feeds the "Identification d'adressage" table of the Informations page
  // (addressing-identification-table.vue). Set to [] to check the empty state.
  addressingIdentifications: [
    { callName: 'Winston Tapia', addressingIdentifier: '12490250636163' },
    { callName: 'Winston Tapia — Siège', addressingIdentifier: '12490250600011' },
    { callName: 'Winston Tapia — Agence Caen', addressingIdentifier: '12490250600029' },
    { callName: 'Winston Tapia — Agence Albi', addressingIdentifier: '12490250600037' },
  ],
  ...DEMAT_MAIL_SCENARIOS[DEMAT_MAIL_SCENARIO],
})

// #endregion

export const devMockHandlers: RequestHandler[] = [
  // Add your handlers here
  http.get('*/connect/api/accounts/602/summary', () => {
    return HttpResponse.json(prospect)
  }),

  http.get('*/gtw/prospect/api/prospects/check-eligibility', () => {
    return HttpResponse.error()
  }),

  http.get('*/prospect/api/onboarding/:accountId/beneficiaries', () => {
    return HttpResponse.json(getBeneficiariesResponse())
  }),

  http.post('*/prospect/api/onboarding/:accountId/beneficiaries/:beneficiaryId/identity-documents', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 201 })
  }),

  http.get('*/prospect/api/onboarding/:accountId/steps', () => {
    return HttpResponse.json(onboardingStepsResponse)
  }),

  // Completes an onboarding step (e.g. beneficiaries, supporting documents)
  http.put('*/prospect/api/onboarding/:accountId/steps/complete', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.get('*/prospect/api/onboarding/:prospectId/documents', () => {
    return HttpResponse.json(conformityDocumentsResponse)
  }),

  http.get('*/prospect/api/onboarding/:accountId/supporting-documents', () => {
    return HttpResponse.json(supportingDocumentsResponse)
  }),

  http.post('*/prospect/api/onboarding/:prospectId/supporting-documents/upload', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 201 })
  }),

  // Shared endpoint: also deletes beneficiaries identity documents
  http.delete('*/prospect/api/onboarding/:accountId/documents/:documentId', async () => {
    await delay(2000)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.get('*/prospect/api/onboarding/:prospectId/documents/:documentId/content', () => {
    return new HttpResponse(new Blob(['mock document content'], { type: 'application/pdf' }), {
      headers: { 'Content-Type': 'application/pdf' },
    })
  }),

  // --- Payment preferences & SEPA mandate (prospect onboarding) ---

  http.get('*/prospect/api/onboarding/:accountId/payment-preferences', () => {
    return HttpResponse.json(getPaymentPreferenceResponse())
  }),

  http.delete('*/prospect/api/onboarding/:accountId/payment-preferences', async () => {
    await delay(800)
    return HttpResponse.json({}, { status: 204 })
  }),

  http.post('*/prospect/api/onboarding/:accountId/payment-preferences/other', async () => {
    await delay(800)
    return HttpResponse.json({}, { status: 204 })
  }),

  // Generate the SEPA mandate and hand back the same-origin signing page (served by the e2e Vite
  // plugin). A fresh mandate is unsigned until "Signer" is clicked in that page.
  http.post('*/prospect/api/onboarding/:accountId/payment-preferences/sepa', async () => {
    await delay(1500)
    isMandateSignedInMock = false
    return HttpResponse.json({ signatureUrl: '/mock/getaccept-signature' })
  }),

  // Hit by the mock signing page's "Signer" button to simulate the GetAccept signature: the next
  // GET payment-preferences then reports MANDATE_SEPA, so the drawer's "Continue" proceeds.
  http.post('*/mock/getaccept-sign', () => {
    isMandateSignedInMock = true
    return HttpResponse.json({}, { status: 204 })
  }),

  // Signed mandate downloaded from the completed step (the real API streams it as a binary file).
  // To test the "mandate not signed yet" case, return `new HttpResponse(null, { status: 404 })`
  // instead (see the real endpoint's 404 behaviour).
  http.get('*/prospect/api/onboarding/:accountId/payment-preferences/sepa/content', async () => {
    await delay(800)
    return new HttpResponse(new Blob(['mock signed SEPA mandate'], { type: 'application/octet-stream' }), {
      headers: { 'Content-Type': 'application/octet-stream' },
    })
  }),

  // #region demat mail collect

  http.get('*/demat/api/accounts/:accountId/currentuser', async ({ params }) => {
    await delay(400)
    return HttpResponse.json(getAccountResponse(Number(params.accountId)))
  }),

  // The back forwards the request to HubSpot; the address only comes back through
  // Akuiteo later on, so this mock deliberately does NOT flip the scenario to
  // 'alreadyFilled' — the front relies on its persisted `submitted` flag meanwhile.
  // Return `HttpResponse.json({}, { status: 500 })` to exercise the error path.
  http.post('*/demat/api/accounts/:accountId/hubspot/submissions/currentuser', async () => {
    await delay(800)
    return HttpResponse.json({}, { status: 204 })
  }),

  // 200 = a submission already dispatched to HubSpot exists for this account (hides the
  // banner/modal even before Akuiteo propagates the mail); 404 = no successful dispatch yet.
  // Return `HttpResponse.json({})` (200) to exercise the "already submitted" scenario.
  http.get('*/registry/api/accounts/:accountId/hubspot/submissions', async () => {
    await delay(400)
    return HttpResponse.json({}, { status: 404 })
  }),

  // #endregion

  // #region folder Informations page

  // Same payload as the demat endpoint: the page must show the very mail the
  // solicitation considers missing.
  http.get('*/account/api/accounts/:accountId/currentuser', async ({ params }) => {
    await delay(400)
    return HttpResponse.json(getAccountResponse(Number(params.accountId)))
  }),

  // Referentials feeding the dropdowns of the form (hub, office, mission type,
  // accounting and VAT blocks). Without them the fields render empty.
  http.get('*/offer/api/referentials/AccountReferentialInformation', () => {
    return HttpResponse.json(accountReferentialInformationMock)
  }),

  http.get('*/offer/api/referentials/hubs', () => {
    return HttpResponse.json(referentialHubsMock)
  }),

  http.get('*/offer/api/referentials/offices', () => {
    return HttpResponse.json(referentialOfficesMock)
  }),

  // "Enregistrer les modifications" — the mock accepts everything without
  // persisting: a reload brings the scenario payload back.
  http.patch('*/account/api/accounts/:accountId/currentuser', async () => {
    await delay(600)
    return HttpResponse.json({}, { status: 204 })
  }),

  // #endregion
]
