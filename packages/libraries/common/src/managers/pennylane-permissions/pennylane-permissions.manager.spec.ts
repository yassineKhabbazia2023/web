import { PennylanePermissionsManager } from './pennylane-permissions.manager'
import { FeatureFlagManager } from '@pulse/core'
import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature } from '@pulse/core/enums'

vi.mock('@pulse/core')
vi.mock('../current-user/current-user.manager')

describe('PennylanePermissionsManager', () => {
  describe('hasPennylaneAccountingPermission', () => {
    const tests = [{
      description: 'should return false if the GED_V2 feature is not activated',
      featureActivated: false,
      hasGedComptaPermission: true,
      hasSelectedEntityPennylanePermission: true,
      expected: false,
    }, {
      description: 'should return false if the user does not have GED Compta permission',
      featureActivated: true,
      hasGedComptaPermission: false,
      hasSelectedEntityPennylanePermission: true,
      expected: false,
    }, {
      description: 'should return false if the user does not have selected entity Pennylane permission',
      featureActivated: true,
      hasGedComptaPermission: true,
      hasSelectedEntityPennylanePermission: false,
      expected: false,
    }, {
      description: 'should return true if all conditions are met',
      featureActivated: true,
      hasGedComptaPermission: true,
      hasSelectedEntityPennylanePermission: true,
      expected: true,
    }]

    it.each(tests)('$description', ({
      featureActivated,
      hasGedComptaPermission,
      hasSelectedEntityPennylanePermission,
      expected,
    }) => {
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(featureActivated)
      vi.spyOn(CurrentUserManager, 'hasGedComptaPermission').mockReturnValue(hasGedComptaPermission)
      vi.spyOn(CurrentUserManager, 'hasSelectedEntityPennylanePermission').mockReturnValue(hasSelectedEntityPennylanePermission)

      const result = PennylanePermissionsManager.hasPennylaneAccountingPermission()

      expect(result).toBe(expected)
      expect(FeatureFlagManager.isFeatureActivated).toHaveBeenCalledWith(Feature.GED_V2)
      if (featureActivated === true) {
        expect(CurrentUserManager.hasGedComptaPermission).toHaveBeenCalledOnce()
      } else {
        expect(CurrentUserManager.hasGedComptaPermission).not.toHaveBeenCalled()
      }
      if (featureActivated === true && hasGedComptaPermission === true) {
        expect(CurrentUserManager.hasSelectedEntityPennylanePermission).toHaveBeenCalled()
      } else {
        expect(CurrentUserManager.hasSelectedEntityPennylanePermission).not.toHaveBeenCalled()
      }
    })
  })
})
