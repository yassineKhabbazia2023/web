import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormRules } from 'element-plus'
import type { FormInstance } from '@pulse/styleguide/types'
import type { PasswordFieldsExposed, PasswordValidationTranslations } from '@pulse/shared/types'
import {
  createNewPasswordValidator,
  createConfirmPasswordValidator,
} from '@pulse/shared/components'
import { UpdatePasswordManager } from './update-password.manager'
import { useUserStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'

/**
 * Composable for UpdatePassword component
 * Manages reactive state and coordinates manager logic
 */
export function useUpdatePassword() {
  const { t } = useI18n({
    inheritLocale: true,
    useScope: 'local',
  })

  const isLoading = ref(false)
  const formRef = ref<FormInstance>()
  const passwordFieldsRef = ref<PasswordFieldsExposed>()
  const serverCurrentPasswordError = ref<string | null>(null)
  const serverNewPasswordError = ref<string | null>(null)

  // Form model
  const formModel = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Password validation translations
  const passwordTranslations: PasswordValidationTranslations = {
    currentPasswordRequired: t('currentPasswordRequired'),
    newPasswordRequired: t('newPasswordRequired'),
    newPasswordWeak: t('newPasswordWeak'),
    confirmPasswordRequired: t('confirmPasswordRequired'),
    confirmPasswordMismatch: t('confirmPasswordMismatch'),
  }

  // Watch for changes in current password to clear server error
  watch(
    () => formModel.currentPassword,
    () => {
      if (serverCurrentPasswordError.value) {
        serverCurrentPasswordError.value = null
      }
    },
  )

  // Watch for changes in new password to clear server error
  watch(
    () => formModel.newPassword,
    () => {
      if (serverNewPasswordError.value) {
        serverNewPasswordError.value = null
      }
    },
  )

  // Validators
  const validateCurrentPassword = UpdatePasswordManager.createCurrentPasswordValidator(
    passwordTranslations,
    () => serverCurrentPasswordError.value,
    true,
  )

  const validateNewPassword = (_rule: any, value: any, callback: any) => {
    // Check for server-side error first
    if (serverNewPasswordError.value) {
      callback(new Error(serverNewPasswordError.value))
      return
    }

    // Then apply standard validation
    createNewPasswordValidator(passwordTranslations)(_rule, value, callback)
  }

  const validateConfirmPassword = createConfirmPasswordValidator(
    passwordTranslations,
    () => formModel.newPassword,
  )

  // pRules
  const rules = reactive<FormRules<typeof formModel>>({
    currentPassword: [{ trigger: 'blur', validator: validateCurrentPassword }],
    newPassword: [{ trigger: 'blur', validator: validateNewPassword }],
    confirmPassword: [{ trigger: 'blur', validator: validateConfirmPassword }],
  })

  const isFormValid = computed(() => {
    if (passwordFieldsRef.value === null || passwordFieldsRef.value === undefined) {
      return false
    }

    const strength = passwordFieldsRef.value.getPasswordStrength()

    return UpdatePasswordManager.validatePasswordForm(
      formModel.currentPassword,
      formModel.newPassword,
      formModel.confirmPassword,
      strength,
    )
  })

  async function handleSubmit() {
    if (formRef.value === null || formRef.value === undefined) {
      return
    }

    // Validate form using pRules
    try {
      await formRef.value.validate()
    } catch (error) {
      logger.error('Can\'t update password:', error)
      return
    }

    isLoading.value = true
    try {
      await UpdatePasswordManager.updateUserPassword(
        {
          oldPassword: formModel.currentPassword,
          newPassword: formModel.newPassword,
        },
        useUserStore().getUserId()!,
      )

      UpdatePasswordManager.displaySuccessNotification(t('notificationSuccess'))

      // Reset form - clears values and validation state
      formRef.value.resetFields()
      passwordFieldsRef.value?.reset()
    } catch (error: any) {
      UpdatePasswordManager.logPasswordUpdateError(error)

      // Handle INVALID_CREDENTIALS error by showing error on current password field
      if (UpdatePasswordManager.isInvalidCredentialsError(error)) {
        serverCurrentPasswordError.value = t('wrongCurrentPassword')
        formRef.value?.validateField('currentPassword')
        return
      }

      // Handle CNT111 error by showing error on new password field
      if (UpdatePasswordManager.isPasswordAlreadyUsedError(error)) {
        serverNewPasswordError.value = t('passwordAlreadyUsed')
        formRef.value?.validateField('newPassword')
        return
      }

      const errorMessage = UpdatePasswordManager.getErrorMessage(error, {
        notificationError: t('notificationError'),
        wrongCurrentPassword: t('wrongCurrentPassword'),
        passwordAlreadyUsed: t('passwordAlreadyUsed'),
      })

      UpdatePasswordManager.displayErrorNotification(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    formRef,
    formModel,
    rules,
    passwordFieldsRef,
    isFormValid,
    handleSubmit,
  }
}
