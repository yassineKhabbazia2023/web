import { ProspectCreationDrawerManager } from './prospect-creation-drawer.manager'
import { getDropdownsContentMock, getProspectFormDataMock } from './__mocks__'
import type { CollaboratorTargetRole } from '@entities/modules/wallet/types'

const CASE_MANAGER_ROLE_ID = 10
const ACCOUNT_MANAGER_ROLE_ID = 11

const collaboratorTargetRoles: CollaboratorTargetRole[] = [
  { id: CASE_MANAGER_ROLE_ID, labelKey: 'MASTER_OF_FILE', label: 'Maître de dossier', isMandatory: true },
  { id: ACCOUNT_MANAGER_ROLE_ID, labelKey: 'ACCOUNT_MANAGER', label: 'Responsable de compte', isMandatory: true },
  { id: 99, labelKey: 'OTHER', label: 'Autre', isMandatory: false },
]

const dropdownsContent = getDropdownsContentMock({
  legalStructure: { PersonneMorale: 'Personne morale' },
})

describe('ProspectCreationDrawerManager', () => {
  describe('convertRecordToDropdownOptions', () => {
    it('returns an empty array when options is an empty object', () => {
      expect(ProspectCreationDrawerManager.convertRecordToDropdownOptions({})).toEqual([])
    })

    it('maps record entries to dropdown options', () => {
      const options = {
        SAS: 'Société par actions simplifiée',
        SARL: 'Société à responsabilité limitée',
      }

      expect(ProspectCreationDrawerManager.convertRecordToDropdownOptions(options)).toEqual([
        { pValue: 'SAS', pLabel: 'Société par actions simplifiée' },
        { pValue: 'SARL', pLabel: 'Société à responsabilité limitée' },
      ])
    })
  })

  describe('toCreationPayload', () => {
    const formData = getProspectFormDataMock({
      siret: '93033121000003',
      legalForm: '5710',
      legalStructure: 'PersonneMorale',
      department: '69',
      region: '84',
      country: 'FR',
      // Extra UI fields that must NOT leak into the payload
      legalName: 'ACME',
      siren: '930331210',
      address: '1 rue de la Paix',
      zipCode: '69001',
      city: 'Lyon',
      nafCode: '6201Z',
      interlocutorRoles: {
        5: CASE_MANAGER_ROLE_ID,
        6: ACCOUNT_MANAGER_ROLE_ID,
      },
      signatory: {
        title: 'M',
        lastName: 'Ben Amor',
        firstName: 'Oussema',
        jobTitle: 'Gérant',
        department: 'Direction',
        companyRole: 'COLLABORATEUR',
        contactTypes: ['isMandateSignatory'],
        email: 'obenamor@example.com',
        mobilePhone: '0612345678',
      },
    })

    it('maps the form scalar fields to the payload', () => {
      const payload = ProspectCreationDrawerManager.toCreationPayload(formData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.siret).toBe('93033121000003')
      expect(payload.legalForm).toBe('5710')
      expect(payload.legalStructure).toBe('Personne morale')
      expect(payload.department).toBe('69')
      expect(payload.region).toBe('84')
      expect(payload.country).toBe('FR')
    })

    it('resolves caseManagerContactId from the MASTER_OF_FILE role', () => {
      const payload = ProspectCreationDrawerManager.toCreationPayload(formData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.caseManagerContactId).toBe(5)
    })

    it('resolves accountManagerContactId from the ACCOUNT_MANAGER role', () => {
      const payload = ProspectCreationDrawerManager.toCreationPayload(formData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.accountManagerContactId).toBe(6)
    })

    it('maps the signatory and converts contactTypes to backend enum values', () => {
      const payload = ProspectCreationDrawerManager.toCreationPayload(formData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.signatory).toEqual({
        title: 'M',
        lastName: 'Ben Amor',
        firstName: 'Oussema',
        jobTitle: 'Gérant',
        department: 'Direction',
        companyRole: 'COLLABORATEUR',
        contactTypes: ['SIGNATAIRE'],
        email: 'obenamor@example.com',
        mobilePhone: '0612345678',
      })
    })

    it.each([
      ['isMandateSignatory', 'SIGNATAIRE'],
      ['isDigitalVaultContact', 'COFFRE_FORT_NUMERIQUE'],
      ['isDebtCollectionContact', 'RECOUVREMENT'],
    ])('maps the form contactType value "%s" to the backend enum "%s"', (formValue, expected) => {
      const customFormData = getProspectFormDataMock({
        ...formData,
        signatory: { ...formData.signatory, contactTypes: [formValue] },
      })

      const payload = ProspectCreationDrawerManager.toCreationPayload(customFormData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.signatory.contactTypes).toEqual([expected])
    })

    it('passes through unknown contactTypes values unchanged', () => {
      const customFormData = getProspectFormDataMock({
        ...formData,
        signatory: {
          ...formData.signatory,
          contactTypes: ['isMandateSignatory', 'UNKNOWN_VALUE'],
        },
      })

      const payload = ProspectCreationDrawerManager.toCreationPayload(customFormData, collaboratorTargetRoles, dropdownsContent)

      expect(payload.signatory.contactTypes).toEqual(['SIGNATAIRE', 'UNKNOWN_VALUE'])
    })

    it('does not include UI-only fields in the payload', () => {
      const payload = ProspectCreationDrawerManager.toCreationPayload(formData, collaboratorTargetRoles, dropdownsContent)

      expect(payload).not.toHaveProperty('legalName')
      expect(payload).not.toHaveProperty('siren')
      expect(payload).not.toHaveProperty('address')
      expect(payload).not.toHaveProperty('zipCode')
      expect(payload).not.toHaveProperty('city')
      expect(payload).not.toHaveProperty('nafCode')
      expect(payload).not.toHaveProperty('interlocutors')
      expect(payload).not.toHaveProperty('interlocutorRoles')
    })

    it('sets caseManagerContactId to null when the MASTER_OF_FILE role is not assigned', () => {
      const incomplete = getProspectFormDataMock({
        ...formData,
        interlocutorRoles: { 6: ACCOUNT_MANAGER_ROLE_ID },
      })

      const payload = ProspectCreationDrawerManager.toCreationPayload(incomplete, collaboratorTargetRoles, dropdownsContent)

      expect(payload.caseManagerContactId).toBeNull()
      expect(payload.accountManagerContactId).toBe(6)
    })
  })
})
