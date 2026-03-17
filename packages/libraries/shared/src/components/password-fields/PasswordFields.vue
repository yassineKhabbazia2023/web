<template>
  <div class="password-fields">
    <!-- Current Password (conditional) -->
    <PFormItem
      v-if="requireCurrentPassword"
      :pLabel="t('currentPassword')"
      prop="currentPassword"
      pRequired
    >
      <PInput
        v-model="currentPassword"
        pType="new-password"
        pShowPassword
        :pPlaceholder="t('currentPasswordPlaceholder')"
        :pDisabled="disabled"
        pAutocomplete="new-password"
      />
    </PFormItem>

    <!-- New Password with Strength Indicator -->
    <PFormItem
      :pLabel="t('newPassword')"
      prop="newPassword"
      pRequired
    >
      <PInput
        v-model="newPassword"
        pType="password"
        pShowPassword
        :pPlaceholder="t('newPasswordPlaceholder')"
        :pDisabled="disabled"
        pAutocomplete="new-password"
        data-testid="password-fields-new-password"
      />
    </PFormItem>

    <!-- Password Strength Indicator -->
    <PStrength
      v-if="newPassword && isPasswordStrengthGaugeVisible"
      :modelValue="passwordStrength"
      :labels="strengthLabels"
      class="margin-bottom--4"
    />

    <!-- Confirm Password -->
    <PFormItem
      :pLabel="t('confirmPassword')"
      prop="confirmPassword"
      pRequired
    >
      <PInput
        v-model="confirmPassword"
        pType="password"
        pShowPassword
        :pPlaceholder="t('confirmPasswordPlaceholder')"
        :pDisabled="disabled"
        pAutocomplete="new-password"
        data-testid="password-fields-confirm-password"
      />
    </PFormItem>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PFormItem, PInput, PStrength } from '@pulse/styleguide/components'
import { PStrengthLevel } from '@pulse/styleguide/types'
import type {
  PasswordFieldsProps,
} from './password-fields.types'
import { getPasswordStrength } from './password-fields.utils'

withDefaults(defineProps<PasswordFieldsProps>(), {
  requireCurrentPassword: false,
  isPasswordStrengthGaugeVisible: false,
  disabled: false,
})

const { t } = useI18n({
  inheritLocale: true,
  messages: {
    'en-US': {
      currentPassword: 'Current password',
      currentPasswordPlaceholder: 'Enter your current password',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Enter your new password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Re-enter your new password',
      currentPasswordRequired: 'Current password is required',
      newPasswordRequired: 'New password is required',
      newPasswordWeak: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
      confirmPasswordRequired: 'Password confirmation is required',
      confirmPasswordMismatch: 'Passwords do not match',
      strengthEmpty: '',
      strengthWeak: 'Weak',
      strengthPoor: 'Poor',
      strengthMedium: 'Medium',
      strengthStrong: 'Strong',
    },
    'fr-FR': {
      currentPassword: 'Mot de passe actuel',
      currentPasswordPlaceholder: 'Saisissez votre mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      newPasswordPlaceholder: 'Saisissez votre nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Ressaisissez votre nouveau mot de passe',
      currentPasswordRequired: 'Le mot de passe actuel est requis',
      newPasswordRequired: 'Le nouveau mot de passe est requis',
      newPasswordWeak: 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial',
      confirmPasswordRequired: 'La confirmation du mot de passe est requise',
      confirmPasswordMismatch: 'Les mots de passe ne correspondent pas',
      strengthEmpty: '',
      strengthWeak: 'Faible',
      strengthPoor: 'Moyen',
      strengthMedium: 'Bon',
      strengthStrong: 'Fort',
    },
  },
})

// Values - using defineModel for two-way binding
const currentPassword = defineModel<string>('currentPassword', { default: '' })
const newPassword = defineModel<string>('newPassword', { default: '' })
const confirmPassword = defineModel<string>('confirmPassword', { default: '' })

// Password strength
const passwordStrength = computed(() => {
  if (!newPassword.value) {
    return PStrengthLevel.EMPTY
  }
  return getPasswordStrength(newPassword.value)
})

// Strength labels
const strengthLabels = computed(() => ({
  [PStrengthLevel.EMPTY]: t('strengthEmpty'),
  [PStrengthLevel.WEAK]: t('strengthWeak'),
  [PStrengthLevel.POOR]: t('strengthPoor'),
  [PStrengthLevel.MEDIUM]: t('strengthMedium'),
  [PStrengthLevel.STRONG]: t('strengthStrong'),
}))

// Exposed methods
function reset() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function getPasswordStrengthLevel(): PStrengthLevel {
  return passwordStrength.value
}

defineExpose({
  reset,
  getPasswordStrength: getPasswordStrengthLevel,
})
</script>

<style lang="scss" scoped>
.password-fields {
  width: 100%;
}
</style>

