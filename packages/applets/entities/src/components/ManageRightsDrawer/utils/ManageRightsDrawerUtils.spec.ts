import { loggerMock } from '@pulse/toolbox/mocks'
import { getMockedAuthorizationState } from '@entities/__mocks__/permissions.mocks'
import { getMockedPennylaneRole, getMockedPennylaneAvailableRole } from '@pulse/common/mocks'
import { PennylaneService, type PennylaneRole } from '@pulse/common/services/pennylane'
import { CustomerPermission } from '@pulse/common/enums'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/constants'
import { updateUserPermissions } from '@entities/services/authorization'
import {
  PennylaneCustomerAccessRightsTrackingManager,
} from '@entities/managers/pennylane-customer-access-rights-tracking/pennylane-customer-access-rights-tracking.manager'

import {
  getPermissionCodes,
  saveActionAdditionalOption,
  getAdditionalOptionByActionCode,
  saveUserPermissions,
  getIsFormValid,
  getPennylaneRoleLabelByCode,
} from '../utils'

beforeEach(() => {
  vi.spyOn(PennylaneService, 'createRole').mockResolvedValue(undefined)
  vi.spyOn(PennylaneService, 'getAccountContactRole').mockResolvedValue(undefined as unknown as PennylaneRole)
  vi.spyOn(PennylaneCustomerAccessRightsTrackingManager, 'track').mockImplementation(() => undefined)
})

const updateUserPermissionsMock = vi.mocked(updateUserPermissions)

const authorizationStateMock = getMockedAuthorizationState()
const roleMock = getMockedPennylaneRole()

const emptyAdditionalOptionByActionCode: Record<string, string> = {}
const adminAdditionalOptionByActionCode: Record<string, string> = {
  [PERMISSION_PENNYLANE_CUSTOMER]: 'admin',
}
const comptaAdditionalOptionByActionCode: Record<string, string> = {
  [PERMISSION_PENNYLANE_CUSTOMER]: 'compta',
}

// Expectations
const expectedPermissionCodeList = [
  CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
  CustomerPermission.ACCEDER_EMBAUCHE_SALARIEE,
  CustomerPermission.ACCEDER_EVP,
  CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
  CustomerPermission.ACCEDER_GED_COMPTABLE,
]

describe('manageRightsDrawerUtils', () => {
  beforeEach(() => {
    updateUserPermissionsMock.mockResolvedValue()
  })

  describe('getPermissionCodes', () => {
    it('should return the permission code list', () => {
      const permissionCodes = getPermissionCodes(authorizationStateMock)

      expect(permissionCodes).toStrictEqual(expectedPermissionCodeList)
    })
  })

  describe('saveActionAdditionalOption', () => {
    describe('when pennylaneRole has changed', () => {
      const tests = [{
        additionalOptionByActionCode: adminAdditionalOptionByActionCode,
        additionalOptionByActionCodeOrigin: undefined,
      }, {
        additionalOptionByActionCode: adminAdditionalOptionByActionCode,
        additionalOptionByActionCodeOrigin: emptyAdditionalOptionByActionCode,
      }, {
        additionalOptionByActionCode: adminAdditionalOptionByActionCode,
        additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
      }]
      it.each(tests)('should call PennylaneService.createRole', ({
        additionalOptionByActionCode,
        additionalOptionByActionCodeOrigin,
      }) => {
        const expectedParameters = {
          accountId: 1,
          contactId: 2,
          role: additionalOptionByActionCode[PERMISSION_PENNYLANE_CUSTOMER],
        }
        saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode,
          additionalOptionByActionCodeOrigin,
        })

        expect(PennylaneService.createRole).toHaveBeenCalledExactlyOnceWith(expectedParameters)
      })
    })

    const tests = [{
      additionalOptionByActionCode: undefined,
      additionalOptionByActionCodeOrigin: undefined,
    }, {
      additionalOptionByActionCode: emptyAdditionalOptionByActionCode,
      additionalOptionByActionCodeOrigin: emptyAdditionalOptionByActionCode,
    }, {
      additionalOptionByActionCode: adminAdditionalOptionByActionCode,
      additionalOptionByActionCodeOrigin: adminAdditionalOptionByActionCode,
    }]
    it.each(tests)('should call NOT PennylaneService.createRole when pennylaneRole has NOT changed', ({
      additionalOptionByActionCode,
      additionalOptionByActionCodeOrigin,
    }) => {
      saveActionAdditionalOption({
        accountId: 1,
        contactId: 2,
        additionalOptionByActionCode,
        additionalOptionByActionCodeOrigin,
      })

      expect(PennylaneService.createRole).not.toHaveBeenCalled()
    })

    describe('tracking', () => {
      beforeEach(() => {
        vi.mocked(PennylaneService.createRole).mockResolvedValue()
      })

      it('should track success when createRole succeeds and tracking params are provided', async () => {
        await saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          localisation: 'modification de droits client',
          roleLabel: 'Admin',
        })

        expect(PennylaneCustomerAccessRightsTrackingManager.track).toHaveBeenCalledExactlyOnceWith({
          localisation: 'modification de droits client',
          roleLabel: 'Admin',
          result: 'succeeded',
        })
      })

      it('should track failure when createRole fails and tracking params are provided', async () => {
        const errorMock = new Error('API error')
        vi.mocked(PennylaneService.createRole).mockRejectedValue(errorMock)

        await expect(saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          localisation: 'ajout nouvel utilisateur client',
          roleLabel: 'Gestionnaire',
        })).rejects.toThrow(errorMock)

        expect(PennylaneCustomerAccessRightsTrackingManager.track).toHaveBeenCalledExactlyOnceWith({
          localisation: 'ajout nouvel utilisateur client',
          roleLabel: 'Gestionnaire',
          result: 'failed',
        })
      })

      it('should NOT track when localisation is undefined', async () => {
        await saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          roleLabel: 'Admin',
        })

        expect(PennylaneCustomerAccessRightsTrackingManager.track).not.toHaveBeenCalled()
      })

      it('should NOT track when roleLabel is undefined', async () => {
        await saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          localisation: 'modification de droits client',
        })

        expect(PennylaneCustomerAccessRightsTrackingManager.track).not.toHaveBeenCalled()
      })

      it('should throw error without tracking when createRole fails and localisation is undefined', async () => {
        const errorMock = new Error('API error')
        vi.mocked(PennylaneService.createRole).mockRejectedValue(errorMock)

        await expect(saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          roleLabel: 'Admin',
        })).rejects.toThrow(errorMock)

        expect(PennylaneCustomerAccessRightsTrackingManager.track).not.toHaveBeenCalled()
      })

      it('should throw error without tracking when createRole fails and roleLabel is undefined', async () => {
        const errorMock = new Error('API error')
        vi.mocked(PennylaneService.createRole).mockRejectedValue(errorMock)

        await expect(saveActionAdditionalOption({
          accountId: 1,
          contactId: 2,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
          localisation: 'modification de droits client',
        })).rejects.toThrow(errorMock)

        expect(PennylaneCustomerAccessRightsTrackingManager.track).not.toHaveBeenCalled()
      })
    })
  })

  describe('getPennylaneRoleLabelByCode', () => {
    const availableRoles = [
      getMockedPennylaneAvailableRole({ code: 'admin', label: 'Administrateur' }),
      getMockedPennylaneAvailableRole({ code: 'manager', label: 'Gestionnaire' }),
      getMockedPennylaneAvailableRole({ code: 'employee', label: 'Employé' }),
    ]

    it('should return the role label when roleCode matches', () => {
      const result = getPennylaneRoleLabelByCode('admin', availableRoles)
      expect(result).toBe('Administrateur')
    })

    it('should return undefined when roleCode is undefined', () => {
      const result = getPennylaneRoleLabelByCode(undefined, availableRoles)
      expect(result).toBeUndefined()
    })

    it('should return undefined when roleCode is empty string', () => {
      const result = getPennylaneRoleLabelByCode('', availableRoles)
      expect(result).toBeUndefined()
    })

    it('should return undefined when roleCode does not match any role', () => {
      const result = getPennylaneRoleLabelByCode('unknown', availableRoles)
      expect(result).toBeUndefined()
    })

    it('should return undefined when availableRoles is empty', () => {
      const result = getPennylaneRoleLabelByCode('admin', [])
      expect(result).toBeUndefined()
    })
  })

  describe('getAdditionalOptionByActionCode', () => {
    const entityIdMock = 11
    const contactIdMock = 12
    it('should return additionnalOptionByActionCode action properly', async () => {
      const expectedAdditionnalOptionByActionCode = {
        [PERMISSION_PENNYLANE_CUSTOMER]: roleMock.role,
      }
      vi.mocked(PennylaneService.getAccountContactRole).mockResolvedValue(roleMock)
      const additionnalOptionByActionCode = await getAdditionalOptionByActionCode({
        entityId: entityIdMock,
        contactId: contactIdMock,
      })

      expect(additionnalOptionByActionCode).toStrictEqual(expectedAdditionnalOptionByActionCode)
    })

    it('should call logger when PennylaneService.getAccountContactRole fails', async () => {
      const expectedAdditionnalOptionByActionCode = {}
      const errorMock = 'error mock'
      const expectedLoggerErrorParams = [
        'Failed to load account Pennylane AccountContactRole',
        errorMock,
      ]

      vi.mocked(PennylaneService.getAccountContactRole).mockRejectedValue(errorMock)
      const additionnalOptionByActionCode = await getAdditionalOptionByActionCode({
        entityId: entityIdMock,
        contactId: contactIdMock,
      })

      expect(additionnalOptionByActionCode).toStrictEqual(expectedAdditionnalOptionByActionCode)
      expect(loggerMock.warn).toHaveBeenCalledExactlyOnceWith(...expectedLoggerErrorParams)
    })
  })

  describe('getIsFormValid', async () => {
    const pennylaneAuthorizationStateMock = {
      ...authorizationStateMock,
      'other': {
        actions: [PERMISSION_PENNYLANE_CUSTOMER],
        isActive: true,
      },
    }
    const tests = [{
      expectedIsFormValid: true,
      authorizationState: authorizationStateMock,
      additionalOptionByActionCode: adminAdditionalOptionByActionCode,
      description: 'pennylane action is not present',
    }, {
      expectedIsFormValid: true,
      authorizationState: pennylaneAuthorizationStateMock,
      additionalOptionByActionCode: adminAdditionalOptionByActionCode,
      description: 'pennylane action AND pennylane role are present',
    }, {
      expectedIsFormValid: false,
      authorizationState: pennylaneAuthorizationStateMock,
      additionalOptionByActionCode: emptyAdditionalOptionByActionCode,
      description: 'pennylane action is present BUT pennylane role is not present',
    }]
    it.each(tests)('should return $expectedIsFormValid when $description', async ({
      authorizationState,
      expectedIsFormValid,
      additionalOptionByActionCode,
    }) => {
      const isFormValid = await getIsFormValid(
        authorizationState,
        additionalOptionByActionCode,
      )

      expect(isFormValid).toBe(expectedIsFormValid)
    })
  })

  describe('test saveUserPermissions', () => {
    const contactId = 1

    describe('when entityId is null', async () => {
      const entityId = null
      const expectedUpdateUserPermissionsParams = [
        contactId,
        entityId,
        expectedPermissionCodeList,
      ]

      it('should return true in nominal case', async () => {
        const expectedIsSuccess = true
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneService.createRole).not.toHaveBeenCalled()
      })

      it('should return false when api throws an error', async () => {
        const errorMock = 'error mock'
        updateUserPermissionsMock.mockRejectedValue(errorMock)
        const expectedIsSuccess = false
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneService.createRole).not.toHaveBeenCalled()
        expect(loggerMock.error).toHaveBeenCalledOnce()
      })
    })

    describe('when entityId is NOT null', async () => {
      const entityId = 2
      const expectedUpdateUserPermissionsParams = [
        contactId,
        entityId,
        expectedPermissionCodeList,
      ]

      beforeEach(() => {
        vi.mocked(PennylaneService.createRole).mockResolvedValue()
      })

      it('should return true in nominal case', async () => {
        const expectedIsSuccess = true
        const expectedParams = {
          accountId: entityId,
          contactId,
          role: 'admin',
        }
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneService.createRole).toHaveBeenCalled()
        expect(PennylaneService.createRole).toHaveBeenCalledWith(expectedParams)
      })

      it('should retourn false when api throws an error', async () => {
        const errorMock = 'error mock'
        const expectedIsSuccess = false
        vi.mocked(PennylaneService.createRole).mockRejectedValue(errorMock)
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(...expectedUpdateUserPermissionsParams)
        expect(loggerMock.error).toHaveBeenCalledOnce()
      })
    })
  })
})
