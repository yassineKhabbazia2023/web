import { ref } from 'vue'
import type { Contact } from '@entities/services/contact/contactTypes'
import { useProspectCreationStepContactValidation } from './prospect-creation-step-contact.form.validation'
import { getCollaboratorTargetRolesMock, getProspectFormDataMock } from '../../__mocks__'

const MANDATORY_ROLES_ALERT_KEY = 'entities.wallet.prospect.form.contact.mandatoryRolesAlert'
const MISSING_INTERLOCUTOR_ROLE_ALERT_KEY = 'entities.wallet.prospect.form.contact.missingInterlocutorRoleAlert'

const getInterlocutorMock = (overrides: Partial<Contact> = {}): Contact => ({
  id: 1,
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice.smith@example.com',
  ...overrides,
} as Contact)

describe('prospect-creation-step-contact.form.validation', () => {
  describe('validate', () => {
    it('should fail when no mandatory role is assigned to any interlocutor', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock())
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(MANDATORY_ROLES_ALERT_KEY)
    })

    it('should fail when only an optional role is assigned', async () => {
      const prospectFormData = ref(getProspectFormDataMock({
        interlocutors: [getInterlocutorMock({ id: 1 })],
        interlocutorRoles: { 1: [2] },
      }))
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock())
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(MANDATORY_ROLES_ALERT_KEY)
    })

    it('should pass when every mandatory role is assigned to at least one interlocutor', async () => {
      const prospectFormData = ref(getProspectFormDataMock({
        interlocutors: [getInterlocutorMock({ id: 1 })],
        interlocutorRoles: { 1: [1] },
      }))
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock())
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })
      validationErrorMessageKey.value = MANDATORY_ROLES_ALERT_KEY

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should fail when an interlocutor has no role assigned', async () => {
      const prospectFormData = ref(getProspectFormDataMock({
        interlocutors: [
          getInterlocutorMock({ id: 1 }),
          getInterlocutorMock({ id: 2 }),
        ],
        interlocutorRoles: { 1: [1] },
      }))
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock())
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(MISSING_INTERLOCUTOR_ROLE_ALERT_KEY)
    })

    it('should pass when the same interlocutor is assigned to a mandatory role and an optional one is also assigned', async () => {
      const prospectFormData = ref(getProspectFormDataMock({
        interlocutors: [
          getInterlocutorMock({ id: 1 }),
          getInterlocutorMock({ id: 2 }),
        ],
        interlocutorRoles: { 1: [1], 2: [2] },
      }))
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock())
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should pass when a single interlocutor is assigned both mandatory roles at once', async () => {
      const prospectFormData = ref(getProspectFormDataMock({
        interlocutors: [getInterlocutorMock({ id: 1 })],
        interlocutorRoles: { 1: [1, 2] },
      }))
      const collaboratorTargetRoles = ref(getCollaboratorTargetRolesMock([
        { isMandatory: true },
        { isMandatory: true },
      ]))
      const { validate, validationErrorMessageKey } = useProspectCreationStepContactValidation({
        prospectFormData,
        collaboratorTargetRoles,
      })

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })
  })
})
