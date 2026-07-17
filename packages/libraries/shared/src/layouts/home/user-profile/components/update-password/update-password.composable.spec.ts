import type { MockInstance } from 'vitest'
import { PStrengthLevel } from '@pulse/styleguide/types'
import { useUpdatePassword, type UpdatePasswordTranslations } from './update-password.composable'
import { UpdatePasswordManager } from './update-password.manager'

import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'

const userStoreMock = getStoreMock(useUserStore)

let validatePasswordFormMock: MockInstance
let updateUserPasswordMock: MockInstance<typeof UpdatePasswordManager.updateUserPassword>
let displaySuccessNotificationMock: MockInstance
let displayErrorNotificationMock: MockInstance
let logPasswordUpdateErrorMock: MockInstance
let isInvalidCredentialsErrorMock: MockInstance
let isPasswordAlreadyUsedErrorMock: MockInstance
let getErrorMessageMock: MockInstance

beforeEach(() => {
  userStoreMock.getUserId.mockReturnValue(12345)

  // doctrine: static-classes — UpdatePasswordManager is a static class, stubbed per test
  validatePasswordFormMock = vi.spyOn(UpdatePasswordManager, 'validatePasswordForm').mockReturnValue(false)
  updateUserPasswordMock = vi.spyOn(UpdatePasswordManager, 'updateUserPassword').mockResolvedValue()
  displaySuccessNotificationMock = vi.spyOn(UpdatePasswordManager, 'displaySuccessNotification').mockReturnValue()
  displayErrorNotificationMock = vi.spyOn(UpdatePasswordManager, 'displayErrorNotification').mockReturnValue()
  logPasswordUpdateErrorMock = vi.spyOn(UpdatePasswordManager, 'logPasswordUpdateError').mockReturnValue()
  isInvalidCredentialsErrorMock = vi.spyOn(UpdatePasswordManager, 'isInvalidCredentialsError').mockReturnValue(false)
  isPasswordAlreadyUsedErrorMock = vi.spyOn(UpdatePasswordManager, 'isPasswordAlreadyUsedError').mockReturnValue(false)
  getErrorMessageMock = vi.spyOn(UpdatePasswordManager, 'getErrorMessage').mockReturnValue('')
})

const mockTranslations: UpdatePasswordTranslations = {
  notificationSuccess: 'notificationSuccess',
  notificationError: 'notificationError',
  wrongCurrentPassword: 'wrongCurrentPassword',
  passwordAlreadyUsed: 'passwordAlreadyUsed',
  currentPasswordRequired: 'currentPasswordRequired',
  newPasswordRequired: 'newPasswordRequired',
  newPasswordWeak: 'newPasswordWeak',
  confirmPasswordRequired: 'confirmPasswordRequired',
  confirmPasswordMismatch: 'confirmPasswordMismatch',
}

describe('useUpdatePassword', () => {
  it('should initialize with correct default values', () => {
    const composable = useUpdatePassword(mockTranslations)

    expect(composable.isLoading.value).toBe(false)
    expect(composable.formModel.currentPassword).toBe('')
    expect(composable.formModel.newPassword).toBe('')
    expect(composable.formModel.confirmPassword).toBe('')
  })

  it('should compute isFormValid correctly when form is valid', () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formModel.currentPassword = 'current'
    composable.formModel.newPassword = 'new'
    composable.formModel.confirmPassword = 'new'

    composable.passwordFieldsRef.value = {
      getPasswordStrength: () => PStrengthLevel.STRONG,
      reset: vi.fn(),
    } as any

    validatePasswordFormMock.mockReturnValue(true)

    expect(composable.isFormValid.value).toBe(true)
    expect(validatePasswordFormMock).toHaveBeenCalledWith(
      'current',
      'new',
      'new',
      PStrengthLevel.STRONG,
    )
  })

  it('should compute isFormValid as false when passwordFieldsRef is not set', () => {
    const composable = useUpdatePassword(mockTranslations)

    expect(composable.isFormValid.value).toBe(false)
  })

  it('should handle successful password update', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = {
      validate: vi.fn().mockResolvedValue(true),
      resetFields: vi.fn(),
      validateField: vi.fn(),
    } as any

    composable.passwordFieldsRef.value = {
      getPasswordStrength: () => PStrengthLevel.STRONG,
      reset: vi.fn(),
    } as any

    composable.formModel.currentPassword = 'current'
    composable.formModel.newPassword = 'new'

    updateUserPasswordMock.mockResolvedValue()

    await composable.handleSubmit()

    expect(composable.isLoading.value).toBe(false)
    expect(updateUserPasswordMock).toHaveBeenCalledWith(
      { oldPassword: 'current', newPassword: 'new' },
      12345,
    )
    expect(displaySuccessNotificationMock).toHaveBeenCalledWith('notificationSuccess')
    expect(composable.formRef.value?.resetFields).toHaveBeenCalledOnce()
    expect(composable.passwordFieldsRef.value?.reset).toHaveBeenCalledOnce()
  })

  it('should handle validation error during submit', async () => {
    const composable = useUpdatePassword(mockTranslations)
    const { logger } = await import('@pulse/toolbox')

    composable.formRef.value = {
      validate: vi.fn().mockRejectedValue(new Error('Validation error')),
      resetFields: vi.fn(),
      validateField: vi.fn(),
    } as any

    await composable.handleSubmit()

    expect(logger.error).toHaveBeenCalledWith('Can\'t update password:', expect.any(Error))
    expect(updateUserPasswordMock).not.toHaveBeenCalled()
  })

  it('should handle INVALID_LOGIN_CODE error during password update', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = {
      validate: vi.fn().mockResolvedValue(true),
      resetFields: vi.fn(),
      validateField: vi.fn(),
    } as any

    composable.passwordFieldsRef.value = {
      getPasswordStrength: () => PStrengthLevel.STRONG,
      reset: vi.fn(),
    } as any

    composable.formModel.currentPassword = 'current'
    composable.formModel.newPassword = 'new'

    const mockError = new Error('Invalid credentials')
    updateUserPasswordMock.mockRejectedValue(mockError)
    isInvalidCredentialsErrorMock.mockReturnValue(true)
    isPasswordAlreadyUsedErrorMock.mockReturnValue(false)

    await composable.handleSubmit()

    expect(isInvalidCredentialsErrorMock).toHaveBeenCalledWith(mockError)
    expect(composable.formRef.value?.validateField).toHaveBeenCalledWith('currentPassword')
    expect(displayErrorNotificationMock).not.toHaveBeenCalled()
  })

  it('should handle CNT111 error during password update', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = {
      validate: vi.fn().mockResolvedValue(true),
      resetFields: vi.fn(),
      validateField: vi.fn(),
    } as any

    composable.passwordFieldsRef.value = {
      getPasswordStrength: () => PStrengthLevel.STRONG,
      reset: vi.fn(),
    } as any

    composable.formModel.currentPassword = 'current'
    composable.formModel.newPassword = 'new'

    const mockError = new Error('Password already used')
    updateUserPasswordMock.mockRejectedValue(mockError)
    isInvalidCredentialsErrorMock.mockReturnValue(false)
    isPasswordAlreadyUsedErrorMock.mockReturnValue(true)

    await composable.handleSubmit()

    expect(isPasswordAlreadyUsedErrorMock).toHaveBeenCalledWith(mockError)
    expect(composable.formRef.value?.validateField).toHaveBeenCalledWith('newPassword')
    expect(displayErrorNotificationMock).not.toHaveBeenCalled()
  })

  it('should handle other errors during password update', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = {
      validate: vi.fn().mockResolvedValue(true),
      resetFields: vi.fn(),
      validateField: vi.fn(),
    } as any

    composable.passwordFieldsRef.value = {
      getPasswordStrength: () => PStrengthLevel.STRONG,
      reset: vi.fn(),
    } as any

    composable.formModel.currentPassword = 'current'
    composable.formModel.newPassword = 'new'

    const mockError = new Error('Some error')
    updateUserPasswordMock.mockRejectedValue(mockError)
    isInvalidCredentialsErrorMock.mockReturnValue(false)
    isPasswordAlreadyUsedErrorMock.mockReturnValue(false)
    getErrorMessageMock.mockReturnValue('Error message')

    await composable.handleSubmit()

    expect(logPasswordUpdateErrorMock).toHaveBeenCalledWith(mockError)
    expect(getErrorMessageMock).toHaveBeenCalledWith(mockError, {
      notificationError: 'notificationError',
      wrongCurrentPassword: 'wrongCurrentPassword',
      passwordAlreadyUsed: 'passwordAlreadyUsed',
    })
    expect(displayErrorNotificationMock).toHaveBeenCalledWith('Error message')
  })

  it('should return early from handleSubmit when formRef is not set', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = undefined

    await composable.handleSubmit()

    expect(updateUserPasswordMock).not.toHaveBeenCalled()
  })
})
