import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature, SubscriptionOfferCode, CustomerPermission, CollaboratorPermission, PennylanePermission } from '@pulse/common/enums'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'

import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'

import { PennylanePermissionsManager } from './pennylane-permissions.manager'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const useUserStoreMock = getStoreMock(useUserStore)

vi.mock('../feature-flag/feature-flag.manager')
vi.mock('../current-user/current-user.manager')

describe('PennylanePermissionsManager', () => {
  const isFeatureActivatedSpy = vi.mocked(FeatureFlagManager.isFeatureActivated)
  const hasOfferSpy = currentEntityStoreMock.hasOffer

  describe('isGedUxV2', () => {
    const tests = [{
      description: 'should return false if the GED_V2 feature is not activated',
      isGedV2FeatureActivated: false,
      hasOfferMock: true,
      expected: false,
    }, {
      description: 'should return false if the selected entity does not have Pennylane offer',
      isGedV2FeatureActivated: true,
      hasOfferMock: false,
      expected: false,
    }, {
      description: 'should return true if all conditions are met',
      isGedV2FeatureActivated: true,
      hasOfferMock: true,
      expected: true,
    }]
    it.each(tests)('$description', ({
      isGedV2FeatureActivated,
      hasOfferMock,
      expected,
    }) => {
      isFeatureActivatedSpy.mockReturnValue(isGedV2FeatureActivated)
      hasOfferSpy.mockReturnValue(hasOfferMock)

      const isGedUxV2 = PennylanePermissionsManager.isGedUxV2()

      expect(isGedUxV2).toBe(expected)

      expect(isFeatureActivatedSpy).toHaveBeenCalledExactlyOnceWith(Feature.GED_V2)

      if (isGedV2FeatureActivated === true) {
        expect(hasOfferSpy).toHaveBeenCalledExactlyOnceWith(SubscriptionOfferCode.PENNYLANE)
      } else {
        expect(hasOfferSpy).not.toHaveBeenCalled()
      }
    })
  })

  describe('hasPennylaneAccountingPermission', () => {
    const tests = [{
      description: 'should return false if the GED_V2 feature is not activated',
      isGedUxV2Mock: false,
      hasGedComptaPermission: true,
      isCollab: false,
      expected: false,
    }, {
      description: 'should return false if the customer does not have GED Compta permission',
      isGedUxV2Mock: true,
      hasGedComptaPermission: false,
      isCollab: false,
      expected: false,
    }, {
      description: 'should return true even if the collab does not have GED Compta permission',
      isGedUxV2Mock: true,
      hasGedComptaPermission: false,
      isCollab: true,
      expected: true,
    }, {
      description: 'should return true if all conditions are met',
      isGedUxV2Mock: true,
      hasGedComptaPermission: true,
      isCollab: false,
      expected: true,
    }]

    it.each(tests)('$description', ({
      isGedUxV2Mock,
      hasGedComptaPermission,
      isCollab,
      expected,
    }) => {
      useUserStoreMock.isCollab = isCollab
      const isGedUxV2Spy = vi
        .spyOn(PennylanePermissionsManager, 'isGedUxV2')
        .mockReturnValue(isGedUxV2Mock)
      const hasPermissionSpy = vi
        .spyOn(CurrentUserManager, 'hasPermission')
        .mockReturnValue(hasGedComptaPermission)

      const result = PennylanePermissionsManager.hasPennylaneAccountingPermission()

      expect(result).toBe(expected)
      expect(isGedUxV2Spy).toHaveBeenCalledWith()

      if (isGedUxV2Mock === true && isCollab === false && hasGedComptaPermission === false) {
        expect(hasPermissionSpy).toHaveBeenCalledTimes(2)
        expect(hasPermissionSpy).toHaveBeenCalledWith(ACCOUNT_PERMISSIONS.PENNYLANE_ACCOUNTING_GED_LEGACY)
      } else if (isGedUxV2Mock === true && isCollab === false) {
        expect(hasPermissionSpy).toHaveBeenCalledExactlyOnceWith(ACCOUNT_PERMISSIONS.PENNYLANE_ACCOUNTING_GED_V2)
      } else {
        expect(hasPermissionSpy).not.toHaveBeenCalled()
      }
    })
  })

  describe('hasSocialManagementV2', () => {
    const requiredSocialManagementPermissions = [
      CollaboratorPermission.GED, // COGED0001
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE, // CLGED0001
    ]
    const tests = [{
      isGedUxV2Mock: true,
      hasSocialManagementPermissionMock: true,
      expected: true,
      description: 'should return true when all conditions are met',
    }, {
      isGedUxV2Mock: false,
      hasSocialManagementPermissionMock: true,
      expected: false,
      description: 'should return false when isGedUxV2 is false',
    }, {
      isGedUxV2Mock: true,
      hasSocialManagementPermissionMock: false,
      expected: false,
      description: 'should return false when the user does not have Social Management permissions',
    }]

    it.each(tests)('$description', ({
      isGedUxV2Mock,
      hasSocialManagementPermissionMock,
      expected,
    }) => {
      const isGedUxV2Spy = vi
        .spyOn(PennylanePermissionsManager, 'isGedUxV2')
        .mockReturnValue(isGedUxV2Mock)
      const hasPermissionSpy = vi
        .spyOn(CurrentUserManager, 'hasPermission')
        .mockReturnValue(hasSocialManagementPermissionMock)

      const hasSocialManagementV2 = PennylanePermissionsManager.hasSocialManagementV2()

      expect(hasSocialManagementV2).toBe(expected)
      expect(isGedUxV2Spy).toHaveBeenCalledOnce()
      if (isGedUxV2Mock === true) {
        expect(hasPermissionSpy).toHaveBeenCalledExactlyOnceWith(requiredSocialManagementPermissions)
      } else {
        expect(hasPermissionSpy).not.toHaveBeenCalled()
      }
    })
  })

  describe('hasPermission', () => {
    it.each([
      { type: PennylanePermission.ACCOUNTING, methodName: 'hasPennylaneAccountingPermission' },
      { type: PennylanePermission.GED_V2, methodName: 'hasPennylaneAccountingGedV2Permission' },
      { type: PennylanePermission.GED_LEGACY, methodName: 'hasPennylaneAccountingGedLegacyPermission' },
      { type: PennylanePermission.SOCIAL_V2, methodName: 'hasSocialManagementV2' },
    ])('should delegate $type to $methodName', ({ type, methodName }) => {
      const spy = vi
        .spyOn(PennylanePermissionsManager, methodName as any)
        .mockReturnValue(true)

      const result = PennylanePermissionsManager.hasPermission(type)

      expect(result).toBe(true)
      expect(spy).toHaveBeenCalledOnce()
    })

    it('should return false when underlying method returns false', () => {
      vi.spyOn(PennylanePermissionsManager, 'hasPennylaneAccountingPermission').mockReturnValue(false)

      const result = PennylanePermissionsManager.hasPermission(PennylanePermission.ACCOUNTING)

      expect(result).toBe(false)
    })
  })
})
