import type { MockInstance } from 'vitest'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { useConformityAccess } from './conformity-access.composable'
import {
  PROSPECT_CONFORMITY_COMPLEMENTARY_DOCUMENTS_PERMISSIONS,
  PROSPECT_CONFORMITY_STEP_PERMISSIONS,
  PROSPECT_CONFORMITY_STEPS,
} from './prospect-conformity.consts'
import { OnboardingStep } from './prospect-conformity.enums'

const userStoreMock = getStoreMock(useUserStore)

describe('useConformityAccess', () => {
  let hasCurrentEntityPermissionMock: MockInstance

  beforeEach(() => {
    userStoreMock.isCollab = false
    hasCurrentEntityPermissionMock = vi.spyOn(CurrentUserManager, 'hasCurrentEntityPermission')
  })

  describe('collaborator user', () => {
    beforeEach(() => {
      userStoreMock.isCollab = true
    })

    it('should grant access to every step without checking permissions', () => {
      const { hasStepAccess } = useConformityAccess()

      PROSPECT_CONFORMITY_STEPS.forEach((step) => {
        expect(hasStepAccess(step.id)).toBe(true)
      })
      expect(hasCurrentEntityPermissionMock).not.toHaveBeenCalled()
    })

    it('should grant access to the complementary documents without checking permissions', () => {
      const { hasComplementaryDocumentsAccess } = useConformityAccess()

      expect(hasComplementaryDocumentsAccess.value).toBe(true)
      expect(hasCurrentEntityPermissionMock).not.toHaveBeenCalled()
    })
  })

  describe('customer user', () => {
    it('should grant access to a step when the user holds its permission', () => {
      hasCurrentEntityPermissionMock.mockReturnValue(true)

      const { hasStepAccess } = useConformityAccess()

      expect(hasStepAccess(OnboardingStep.Beneficiary)).toBe(true)
      expect(hasCurrentEntityPermissionMock).toHaveBeenCalledWith(
        PROSPECT_CONFORMITY_STEP_PERMISSIONS[OnboardingStep.Beneficiary],
      )
    })

    it('should deny access to a step when the user lacks its permission', () => {
      hasCurrentEntityPermissionMock.mockReturnValue(false)

      const { hasStepAccess } = useConformityAccess()

      expect(hasStepAccess(OnboardingStep.EngagementLetter)).toBe(false)
    })

    it('should evaluate each step independently', () => {
      hasCurrentEntityPermissionMock.mockImplementation(
        (permissions) => permissions === PROSPECT_CONFORMITY_STEP_PERMISSIONS[OnboardingStep.PaymentMethod],
      )

      const { hasStepAccess } = useConformityAccess()

      expect(hasStepAccess(OnboardingStep.PaymentMethod)).toBe(true)
      expect(hasStepAccess(OnboardingStep.Beneficiary)).toBe(false)
      expect(hasStepAccess(OnboardingStep.SupportingDocuments)).toBe(false)
      expect(hasStepAccess(OnboardingStep.CommercialProposal)).toBe(false)
      expect(hasStepAccess(OnboardingStep.EngagementLetter)).toBe(false)
    })

    it('should check the dedicated permission for the complementary documents', () => {
      hasCurrentEntityPermissionMock.mockImplementation(
        (permissions) => permissions === PROSPECT_CONFORMITY_COMPLEMENTARY_DOCUMENTS_PERMISSIONS,
      )

      const { hasComplementaryDocumentsAccess, hasStepAccess } = useConformityAccess()

      expect(hasComplementaryDocumentsAccess.value).toBe(true)
      expect(hasStepAccess(OnboardingStep.SupportingDocuments)).toBe(false)
    })

    it('should deny access to the complementary documents when the user lacks the permission', () => {
      hasCurrentEntityPermissionMock.mockReturnValue(false)

      const { hasComplementaryDocumentsAccess } = useConformityAccess()

      expect(hasComplementaryDocumentsAccess.value).toBe(false)
    })
  })

  describe('user not hydrated yet', () => {
    it('should fall back to the permission check when isCollab is undefined', () => {
      userStoreMock.isCollab = undefined
      hasCurrentEntityPermissionMock.mockReturnValue(false)

      const { hasStepAccess } = useConformityAccess()

      expect(hasStepAccess(OnboardingStep.Beneficiary)).toBe(false)
      expect(hasCurrentEntityPermissionMock).toHaveBeenCalled()
    })
  })
})
