import type { PDropdownOption } from '@pulse/styleguide/types'
import type {
  CollaboratorTargetRole,
  ProspectCreationDropdownContent,
  ProspectCreationPayload,
  ProspectFormData,
} from '@entities/modules/wallet/types'
import { SIGNATORY_CONTACT_TYPE } from './prospect-creation-drawer.const'

const CASE_MANAGER_ROLE_LABEL_KEY = 'MASTER_OF_FILE'
const ACCOUNT_MANAGER_ROLE_LABEL_KEY = 'ACCOUNT_MANAGER'

// Maps the dropdown values stored in the form to the backend ContactType enum.
// Unknown keys pass through so a form value already aligned with the enum still works.
const CONTACT_TYPE_MAPPING: Record<string, string> = {
  [SIGNATORY_CONTACT_TYPE]: 'SIGNATAIRE',
  isDigitalVaultContact: 'COFFRE_FORT_NUMERIQUE',
  isDebtCollectionContact: 'RECOUVREMENT',
}

export class ProspectCreationDrawerManager {
  /**
   * Converts a key-value Record (from API response) to PDropdownOption array.
   * The API returns dropdown values as { code: label } objects, but PDropdown
   * expects an array of { pValue, pLabel } objects.
   */
  static convertRecordToDropdownOptions(options: Record<string, string>): PDropdownOption[] {
    return Object
      .entries(options)
      .map(([value, label]) => ({ pValue: value, pLabel: label }))
  }

  /**
   * Builds the "Type de contact" dropdown options. The mandatory signatory option
   * is locked (pDisabled) so it stays selected and cannot be removed by the user;
   * only the other contact types remain toggleable.
   */
  static toContactTypeOptions(contactType: Record<string, string>): PDropdownOption[] {
    return ProspectCreationDrawerManager.convertRecordToDropdownOptions(contactType)
      .map((option) => option.pValue === SIGNATORY_CONTACT_TYPE
        ? { ...option, pDisabled: true }
        : option)
  }

  /**
   * Maps the rich UI form data to the lean payload accepted by
   * POST /prospect/prospects/currentuser. `caseManagerContactId` and
   * `accountManagerContactId` are resolved from `interlocutorRoles` using the
   * role `labelKey` (temporary mapping until the backend accepts a roles array).
   * `legalStructure` is resolved from its dropdown key to the human-readable
   * label expected by the backend.
   */
  static toCreationPayload(
    formData: ProspectFormData,
    collaboratorTargetRoles: CollaboratorTargetRole[],
    dropdownsContent: ProspectCreationDropdownContent,
  ): ProspectCreationPayload {
    const caseManagerRoleId = collaboratorTargetRoles
      .find((role) => role.labelKey === CASE_MANAGER_ROLE_LABEL_KEY)?.id
    const accountManagerRoleId = collaboratorTargetRoles
      .find((role) => role.labelKey === ACCOUNT_MANAGER_ROLE_LABEL_KEY)?.id

    const contactIdByRoleId = new Map<number, number>()
    for (const [contactIdString, roleId] of Object.entries(formData.interlocutorRoles)) {
      if (roleId === null || roleId === undefined) {
        continue
      }
      contactIdByRoleId.set(roleId, Number(contactIdString))
    }

    const caseManagerContactId = caseManagerRoleId === undefined
      ? null
      : contactIdByRoleId.get(caseManagerRoleId) ?? null
    const accountManagerContactId = accountManagerRoleId === undefined
      ? null
      : contactIdByRoleId.get(accountManagerRoleId) ?? null

    return {
      siret: formData.siret,
      legalForm: formData.legalForm,
      legalStructure: dropdownsContent.legalStructure[formData.legalStructure] ?? formData.legalStructure,
      caseManagerContactId,
      accountManagerContactId,
      department: formData.department,
      // Default region code used when the form has not provided one, until the
      // region selection step is wired into the UI.
      region: formData.region === '' ? '11' : formData.region,
      country: formData.country,
      signatory: {
        ...formData.signatory,
        contactTypes: formData.signatory.contactTypes
          .map((value) => CONTACT_TYPE_MAPPING[value] ?? value),
      },
    }
  }
}
