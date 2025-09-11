import { FeatureFlagManager } from '@pulse/core'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature } from '@pulse/core/enums'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'
import { SubscriptionOfferCode, CustomerPermission, CollaboratorPermission } from '@pulse/common/enums'

import { PennylanePermissionsManager } from './pennylane-permissions.manager'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

vi.mock('@pulse/core')
vi.mock('../current-user/current-user.manager')

describe('PennylanePermissionsManager', () => {
  const isFeatureActivatedSpy = vi.mocked(FeatureFlagManager).isFeatureActivated
  const hasOfferSpy = selectedEntityStoreMock.hasOffer

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

      expect(isFeatureActivatedSpy).toHaveBeenCalledOnce()
      expect(isFeatureActivatedSpy).toHaveBeenCalledWith(Feature.GED_V2)

      if (isGedV2FeatureActivated === true) {
        expect(hasOfferSpy).toHaveBeenCalledOnce()
        expect(hasOfferSpy).toHaveBeenCalledWith(SubscriptionOfferCode.PENNYLANE)
      } else {
        expect(hasOfferSpy).not.toHaveBeenCalled()
      }
    })
  })

  describe('hasPennylaneAccountingPermission', () => {
    const requiredPermissions = [
      CollaboratorPermission.ACCEDER_GED_COMPTABLE, // COGED0002
      CustomerPermission.ACCEDER_GED_COMPTABLE, // CLGED0002
      CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE, // CLGEDPEN01
    ]
    const tests = [{
      description: 'should return false if the GED_V2 feature is not activated',
      isGedUxV2Mock: false,
      hasGedComptaPermission: true,
      expected: false,
    }, {
      description: 'should return false if the user does not have GED Compta permission',
      isGedUxV2Mock: true,
      hasGedComptaPermission: false,
      expected: false,
    }, {
      description: 'should return true if all conditions are met',
      isGedUxV2Mock: true,
      hasGedComptaPermission: true,
      expected: true,
    }]

    it.each(tests)('$description', ({
      isGedUxV2Mock,
      hasGedComptaPermission,
      expected,
    }) => {
      const isGedUxV2Spy = vi
        .spyOn(PennylanePermissionsManager, 'isGedUxV2')
        .mockReturnValue(isGedUxV2Mock)
      const hasPermissionSpy = vi
        .spyOn(CurrentUserManager, 'hasPermission')
        .mockReturnValue(hasGedComptaPermission)

      const result = PennylanePermissionsManager.hasPennylaneAccountingPermission()

      expect(result).toBe(expected)
      expect(isGedUxV2Spy).toHaveBeenCalledWith()
      if (isGedUxV2Mock === true) {
        expect(hasPermissionSpy).toHaveBeenCalledOnce()
        expect(hasPermissionSpy).toHaveBeenCalledWith(requiredPermissions)
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
        expect(hasPermissionSpy).toHaveBeenCalledOnce()
        expect(hasPermissionSpy).toHaveBeenCalledWith(requiredSocialManagementPermissions)
      } else {
        expect(hasPermissionSpy).not.toHaveBeenCalled()
      }
    })
  })
})
