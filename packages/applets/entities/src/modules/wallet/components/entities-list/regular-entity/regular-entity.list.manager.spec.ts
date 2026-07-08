import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { MenuTranslations } from './regular-entity.list.types'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import { filterAccessibleMenuItems } from '@entities/utils'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { RegularEntitiesListManager } from './regular-entity.list.manager'
import { RegularEntityAction } from './regular-entity.list.enums'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))
vi.mock('@entities/utils')

vi.mocked(filterAccessibleMenuItems).mockImplementation((items) => items as PToolboxItemProps[])

const translations: MenuTranslations = {
  accessThisFolder: 'Access this folder',
  deployThisFolder: 'Deploy this folder',
  delegateThisFolder: 'Delegate this folder',
  resendActivationEmail: 'Resend activation email',
  declareCustomerRelation: 'Declare customer relation',
  removeCurrentUserFromThisFolder: 'Remove myself from this folder',
  toDeploy: 'To deploy',
}

describe('RegularEntitiesListManager', () => {
  describe('buildDefaultMenuElements', () => {
    it('should return 5 menu items with correct action names', () => {
      const result = RegularEntitiesListManager.buildDefaultMenuElements(translations)

      expect(result).toHaveLength(5)
      expect(result[0].pActionName).toBe(RegularEntityAction.ACCESS)
      expect(result[1].pActionName).toBe(RegularEntityAction.DELEGATE_FOLDER)
      expect(result[2].pActionName).toBe(RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL)
      expect(result[3].pActionName).toBe(RegularEntityAction.DECLARE_CUSTOMER_RELATION)
      expect(result[4].pActionName).toBe(RegularEntityAction.REMOVE_CURRENT_USER_FROM_FOLDER)
    })

    it('should check ACTIVATE_OFFER permission for resend email item', () => {
      RegularEntitiesListManager.buildDefaultMenuElements(translations)

      expect(hasPermissionMock).toHaveBeenCalledWith(ACTION_PERMISSIONS.ACTIVATE_OFFER)
    })

    it('should use translation values for menu labels', () => {
      const result = RegularEntitiesListManager.buildDefaultMenuElements(translations)

      expect(result[0].pValue).toBe('Access this folder')
      expect(result[1].pValue).toBe('Delegate this folder')
      expect(result[2].pValue).toBe('Resend activation email')
      expect(result[3].pValue).toBe('Declare customer relation')
      expect(result[4].pValue).toBe('Remove myself from this folder')
    })
  })

  describe('buildMenuToDeployElements', () => {
    it('should return 6 items with deploy action first', () => {
      const result = RegularEntitiesListManager.buildMenuToDeployElements(translations)

      expect(result).toHaveLength(6)
      expect(result[0].pActionName).toBe(RegularEntityAction.DEPLOY)
    })

    it('should include default menu items after deploy', () => {
      const result = RegularEntitiesListManager.buildMenuToDeployElements(translations)

      expect(result[1].pActionName).toBe(RegularEntityAction.ACCESS)
      expect(result[2].pActionName).toBe(RegularEntityAction.DELEGATE_FOLDER)
      expect(result[3].pActionName).toBe(RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL)
      expect(result[4].pActionName).toBe(RegularEntityAction.DECLARE_CUSTOMER_RELATION)
      expect(result[5].pActionName).toBe(RegularEntityAction.REMOVE_CURRENT_USER_FROM_FOLDER)
    })
  })

  describe('getLastActivityDateLabel', () => {
    it('should return the date formatted with the fr-FR locale', () => {
      expect(RegularEntitiesListManager.getLastActivityDateLabel('2026-06-02T10:00:00')).toBe('02/06/2026')
    })

    it('should return the fallback label when the date is null', () => {
      expect(RegularEntitiesListManager.getLastActivityDateLabel(null)).toBe('-')
    })
  })

  describe('getMenuElementsForRow', () => {
    it('should return deploy menu elements when deploymentStatusText matches toDeployLabel', () => {
      const result = RegularEntitiesListManager.getMenuElementsForRow(
        translations.toDeploy,
        translations.toDeploy,
        translations,
      )

      expect(result).toHaveLength(6)
      expect(result[0].pActionName).toBe(RegularEntityAction.DEPLOY)
    })

    it('should return default menu elements when deploymentStatusText does not match toDeployLabel', () => {
      const result = RegularEntitiesListManager.getMenuElementsForRow(
        'Active',
        translations.toDeploy,
        translations,
      )

      expect(result).toHaveLength(5)
      expect(result[0].pActionName).toBe(RegularEntityAction.ACCESS)
    })

    it('should pass menu items through filterAccessibleMenuItems', () => {
      RegularEntitiesListManager.getMenuElementsForRow(
        'Active',
        translations.toDeploy,
        translations,
      )

      expect(filterAccessibleMenuItems).toHaveBeenCalled()
    })
  })
})
