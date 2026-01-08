<template>
  <div class="update-password">
    <PForm
      ref="formRef"
      :pModel="formModel"
      :pRules="rules"
      pLabelPosition="top"
      @submit.prevent="handleSubmit"
    >
      <PasswordFields
        ref="passwordFieldsRef"
        v-model:currentPassword="formModel.currentPassword"
        v-model:newPassword="formModel.newPassword"
        v-model:confirmPassword="formModel.confirmPassword"
        isPasswordStrengthGaugeVisible
        :requireCurrentPassword="true"
        :disabled="isLoading"
      />

      <Teleport to="#update-password__footer-drawer">
        <PButton
          pType="primary"
          :pLoading="isLoading"
          :pDisabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ t('saveChanges') }}
        </PButton>
      </Teleport>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PForm } from '@pulse/styleguide/components'
import { PasswordFields } from '@pulse/shared/components'
import { useUpdatePassword } from './update-password.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const {
  isLoading,
  formRef,
  formModel,
  rules,
  passwordFieldsRef,
  isFormValid,
  handleSubmit,
} = useUpdatePassword()
</script>

<style lang="scss" scoped>
.update-password {
  padding-top: 20px;
}
</style>

<i18n lang="yaml">
en-US:
  saveChanges: 'Save changes'
  notificationSuccess: 'Your password has been successfully updated'
  notificationError: 'An error occurred while updating your password'
  wrongCurrentPassword: 'Current password is incorrect'
  passwordAlreadyUsed: 'This password has already been used'
  currentPasswordRequired: 'Current password is required'
  newPasswordRequired: 'New password is required'
  newPasswordWeak: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character'
  confirmPasswordRequired: 'Password confirmation is required'
  confirmPasswordMismatch: 'Passwords do not match'
fr-FR:
  saveChanges: 'Enregistrer les modifications'
  notificationSuccess: 'Votre mot de passe a été mis à jour avec succès'
  notificationError: 'Une erreur est survenue lors de la mise à jour de votre mot de passe'
  wrongCurrentPassword: 'Le mot de passe actuel est incorrect'
  passwordAlreadyUsed: 'Vous avez déjà utilisé ce mot de passe précédemment'
  currentPasswordRequired: 'Le mot de passe actuel est requis'
  newPasswordRequired: 'Le nouveau mot de passe est requis'
  newPasswordWeak: 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial'
  confirmPasswordRequired: 'La confirmation du mot de passe est requise'
  confirmPasswordMismatch: 'Les mots de passe ne correspondent pas'
</i18n>
