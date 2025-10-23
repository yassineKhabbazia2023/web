import { loggerMock } from '@pulse/toolbox/mocks'
import { getMockedAuthorizationState } from '@entities/__mocks__/permissions.mocks'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { getMockedPennylaneRole } from '@pulse/common/mocks'
import { CustomerPermission } from '@pulse/common/enums'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/constants/rights-management.const'
import { updateUserPermissions } from '@entities/services/authorization'

import {
  getPermissionCodes,
  saveActionAdditionalOption,
  getAdditionalOptionByActionCode,
  saveUserPermissions,
  getIsFormValid,
} from '../utils'

// Mocks
vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

vi.mock('@pulse/common/services/pennylane')
vi.mock('@entities/services/authorization')

const PennylaneServiceMock = vi.mocked(PennylaneService)
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

        expect(PennylaneService.createRole).toHaveBeenCalledOnce()
        expect(PennylaneService.createRole).toHaveBeenCalledWith(expectedParameters)
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
  })

  describe('getAdditionalOptionByActionCode', () => {
    const entityIdMock = 11
    const contactIdMock = 12
    it('should return additionnalOptionByActionCode action properly', async () => {
      const expectedAdditionnalOptionByActionCode = {
        [PERMISSION_PENNYLANE_CUSTOMER]: roleMock.role,
      }
      PennylaneServiceMock.getAccountContactRole.mockResolvedValue(roleMock)
      const additionnalOptionByActionCode = await getAdditionalOptionByActionCode({
        entityId: entityIdMock,
        contactId: contactIdMock,
      })

      expect(additionnalOptionByActionCode).toStrictEqual(expectedAdditionnalOptionByActionCode)
    })

    it('should call logger when PennylaneServiceMock.getAccountContactRole fails', async () => {
      const expectedAdditionnalOptionByActionCode = {}
      const errorMock = 'error mock'
      const expectedLoggerErrorParams = [
        'Failed to load account Pennylane AccountContactRole',
        errorMock,
      ]

      PennylaneServiceMock.getAccountContactRole.mockRejectedValue(errorMock)
      const additionnalOptionByActionCode = await getAdditionalOptionByActionCode({
        entityId: entityIdMock,
        contactId: contactIdMock,
      })

      expect(additionnalOptionByActionCode).toStrictEqual(expectedAdditionnalOptionByActionCode)
      expect(loggerMock.warn).toHaveBeenCalledOnce()
      expect(loggerMock.warn).toHaveBeenCalledWith(...expectedLoggerErrorParams)
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

      it('should retourn true in nominal case', async () => {
        const expectedIsSuccess = true
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledOnce()
        expect(updateUserPermissionsMock).toHaveBeenCalledWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneServiceMock.createRole).not.toHaveBeenCalled()
      })

      it('should retourn false when api throws an error', async () => {
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

        expect(updateUserPermissionsMock).toHaveBeenCalledOnce()
        expect(updateUserPermissionsMock).toHaveBeenCalledWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneServiceMock.createRole).not.toHaveBeenCalled()
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

      it('should retourn true in nominal case', async () => {
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

        expect(updateUserPermissionsMock).toHaveBeenCalledOnce()
        expect(updateUserPermissionsMock).toHaveBeenCalledWith(...expectedUpdateUserPermissionsParams)

        expect(PennylaneServiceMock.createRole).toHaveBeenCalled()
        expect(PennylaneServiceMock.createRole).toHaveBeenCalledWith(expectedParams)
      })

      it('should retourn false when api throws an error', async () => {
        const errorMock = 'error mock'
        const expectedIsSuccess = false
        PennylaneServiceMock.createRole.mockRejectedValue(errorMock)
        const isSuccess = await saveUserPermissions({
          contactId,
          entityId,
          authorizationsState: authorizationStateMock,
          additionalOptionByActionCode: adminAdditionalOptionByActionCode,
          additionalOptionByActionCodeOrigin: comptaAdditionalOptionByActionCode,
        })
        expect(isSuccess).toBe(expectedIsSuccess)

        expect(updateUserPermissionsMock).toHaveBeenCalledOnce()
        expect(updateUserPermissionsMock).toHaveBeenCalledWith(...expectedUpdateUserPermissionsParams)
        expect(loggerMock.error).toHaveBeenCalledOnce()
      })
    })
  })
})
