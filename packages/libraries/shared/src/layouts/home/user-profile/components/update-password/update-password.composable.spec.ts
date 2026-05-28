import { PStrengthLevel } from '@pulse/styleguide/types'
import { useUpdatePassword, type UpdatePasswordTranslations } from './update-password.composable'
import { UpdatePasswordManager } from './update-password.manager'

vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    getUserId: () => 12345,
  }),
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: vi.fn(),
  },
}))

vi.mock('./update-password.manager')

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

    vi.mocked(UpdatePasswordManager.validatePasswordForm).mockReturnValue(true)

    expect(composable.isFormValid.value).toBe(true)
    expect(UpdatePasswordManager.validatePasswordForm).toHaveBeenCalledWith(
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

    vi.mocked(UpdatePasswordManager.updateUserPassword).mockResolvedValue()

    await composable.handleSubmit()

    expect(composable.isLoading.value).toBe(false)
    expect(UpdatePasswordManager.updateUserPassword).toHaveBeenCalledWith(
      { oldPassword: 'current', newPassword: 'new' },
      12345,
    )
    expect(UpdatePasswordManager.displaySuccessNotification).toHaveBeenCalledWith('notificationSuccess')
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
    expect(UpdatePasswordManager.updateUserPassword).not.toHaveBeenCalled()
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
    vi.mocked(UpdatePasswordManager.updateUserPassword).mockRejectedValue(mockError)
    vi.mocked(UpdatePasswordManager.isInvalidCredentialsError).mockReturnValue(true)
    vi.mocked(UpdatePasswordManager.isPasswordAlreadyUsedError).mockReturnValue(false)

    await composable.handleSubmit()

    expect(UpdatePasswordManager.isInvalidCredentialsError).toHaveBeenCalledWith(mockError)
    expect(composable.formRef.value?.validateField).toHaveBeenCalledWith('currentPassword')
    expect(UpdatePasswordManager.displayErrorNotification).not.toHaveBeenCalled()
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
    vi.mocked(UpdatePasswordManager.updateUserPassword).mockRejectedValue(mockError)
    vi.mocked(UpdatePasswordManager.isInvalidCredentialsError).mockReturnValue(false)
    vi.mocked(UpdatePasswordManager.isPasswordAlreadyUsedError).mockReturnValue(true)

    await composable.handleSubmit()

    expect(UpdatePasswordManager.isPasswordAlreadyUsedError).toHaveBeenCalledWith(mockError)
    expect(composable.formRef.value?.validateField).toHaveBeenCalledWith('newPassword')
    expect(UpdatePasswordManager.displayErrorNotification).not.toHaveBeenCalled()
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
    vi.mocked(UpdatePasswordManager.updateUserPassword).mockRejectedValue(mockError)
    vi.mocked(UpdatePasswordManager.isInvalidCredentialsError).mockReturnValue(false)
    vi.mocked(UpdatePasswordManager.isPasswordAlreadyUsedError).mockReturnValue(false)
    vi.mocked(UpdatePasswordManager.getErrorMessage).mockReturnValue('Error message')

    await composable.handleSubmit()

    expect(UpdatePasswordManager.logPasswordUpdateError).toHaveBeenCalledWith(mockError)
    expect(UpdatePasswordManager.getErrorMessage).toHaveBeenCalledWith(mockError, {
      notificationError: 'notificationError',
      wrongCurrentPassword: 'wrongCurrentPassword',
      passwordAlreadyUsed: 'passwordAlreadyUsed',
    })
    expect(UpdatePasswordManager.displayErrorNotification).toHaveBeenCalledWith('Error message')
  })

  it('should return early from handleSubmit when formRef is not set', async () => {
    const composable = useUpdatePassword(mockTranslations)

    composable.formRef.value = undefined

    await composable.handleSubmit()

    expect(UpdatePasswordManager.updateUserPassword).not.toHaveBeenCalled()
  })
})
