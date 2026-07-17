import type { MockInstance } from 'vitest'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { filterAccessibleMenuItems } from '@entities/utils'
import { ACTION_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { EntitiesManagementListManager } from './entities-management.list.manager'
import { EntitiesManagementAction } from './entities-management.list.enums'

// The real '@pulse/common/i18n' instance has no messages loaded, so t()
// already returns the raw key the assertions expect.
let hasPermissionMock: MockInstance

beforeEach(() => {
  hasPermissionMock = armCurrentUserPermissions(false)
  vi.mocked(filterAccessibleMenuItems).mockImplementation((items) => items as PToolboxItemProps[])
})

describe('EntitiesManagementListManager', () => {
  describe('buildMenu', () => {
    it('should return 2 menu items with correct action names', () => {
      const result = EntitiesManagementListManager.buildMenu()

      expect(result).toHaveLength(2)
      expect(result[0].pActionName).toBe(EntitiesManagementAction.MANAGE_ACCOUNT_RIGHTS)
      expect(result[1].pActionName).toBe(EntitiesManagementAction.RETRY_MASS_ACTIVATION_EMAIL)
    })

    it('should use i18n keys for menu labels', () => {
      const result = EntitiesManagementListManager.buildMenu()

      expect(result[0].pValue).toBe('entities.wallet.entitiesListRegular.manageAccountRights')
      expect(result[1].pValue).toBe('entities.wallet.entitiesListRegular.resendActivationEmail')
    })

    it('should set correct icon names', () => {
      const result = EntitiesManagementListManager.buildMenu()

      expect(result[0].pIconName).toBe('grid')
      expect(result[1].pIconName).toBe('send')
    })

    it('should set default state for all items', () => {
      const result = EntitiesManagementListManager.buildMenu()

      expect(result[0].pState).toBe('default')
      expect(result[1].pState).toBe('default')
    })

    it('should check MODIFY_ACCOUNT_RIGHTS permission for manage account rights item', () => {
      EntitiesManagementListManager.buildMenu()

      expect(hasPermissionMock).toHaveBeenCalledWith(ACTION_PERMISSIONS.MODIFY_ACCOUNT_RIGHTS)
    })

    it('should check ACCOUNT_MANAGEMENT permission for resend activation email item', () => {
      EntitiesManagementListManager.buildMenu()

      expect(hasPermissionMock).toHaveBeenCalledWith(GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT)
    })
  })

  describe('getMenuElements', () => {
    it('should pass menu items through filterAccessibleMenuItems', () => {
      EntitiesManagementListManager.getMenuElements()

      expect(filterAccessibleMenuItems).toHaveBeenCalled()
    })

    it('should return filtered menu items', () => {
      const result = EntitiesManagementListManager.getMenuElements()

      expect(result).toHaveLength(2)
      expect(result[0].pActionName).toBe(EntitiesManagementAction.MANAGE_ACCOUNT_RIGHTS)
      expect(result[1].pActionName).toBe(EntitiesManagementAction.RETRY_MASS_ACTIVATION_EMAIL)
    })

    it('should return empty array when filterAccessibleMenuItems filters all items', () => {
      vi.mocked(filterAccessibleMenuItems).mockReturnValueOnce([])

      const result = EntitiesManagementListManager.getMenuElements()

      expect(result).toHaveLength(0)
    })
  })
})
