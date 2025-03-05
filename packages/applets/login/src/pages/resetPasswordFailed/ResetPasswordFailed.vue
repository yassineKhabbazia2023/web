<template>
  <div class="reset-password-failed margin-top--12">
    <div class="reset-password-failed__circle flex flex--align-items-center flex--justify-content-center margin--auto">
      <PIcon
        pName="x"
        :pColor="AppColors.RED_TXT"
        size="32"
      />
    </div>
    <div class="padding--2">
      <p
        class="font-bold font-large margin-top--6"
        data-testid="password-change-denied-para"
      >
        {{ t('passwordChangeDenied') }}
      </p>
      <p
        class="margin-top--2"
        data-testid="password-change-limit-exceeded-para"
      >
        {{ t('passwordChangeLimitExceeded', { maxAttempts }) }}
      </p>
    </div>
    <PButton
      pType="white"
      class="reset-password-failed__back-to-login-button margin-y--10"
      data-testid="back-to-login-button"
      @click="router.push({ name: LoginRouteName.LOGIN_CLIENT })"
    >
      {{ t('backToLogin') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { AppColors } from '@pulse/styleguide'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { LoginRouteName } from '@pulse/common/constants'
import { VITE_PASSWORD_RESET_MAX_ATTEMPTS } from 'env-vars'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()

const maxAttempts = computed(() => VITE_PASSWORD_RESET_MAX_ATTEMPTS || 5)
</script>

<style lang="scss" scoped>
.reset-password-failed {
  &__circle {
    width: 56px;
    height: 56px;
    background-color: var(--el-color-functionnal-red-bg);
    border-radius: 50%;
  }
}
</style>

<i18n lang="yaml">
en-US:
  backToLogin: 'Back to login'
  passwordChangeDenied: 'Password change denied'
  passwordChangeLimitExceeded: 'You cannot change your password more than {maxAttempts} times in the same day'
fr-FR:
  backToLogin: 'Revenir à la connexion'
  passwordChangeDenied: 'Changement de mot de passe refusé'
  passwordChangeLimitExceeded: >
    Vous ne pouvez pas modifier votre mot de passe plus de {maxAttempts} fois dans la même journée.
</i18n>
