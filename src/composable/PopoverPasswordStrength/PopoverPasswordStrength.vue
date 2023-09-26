<template>
  <PPopover
    :placement="top"
    :disabled="false"
    :title="t('popupTitle')"
    trigger="click"
    showArrow
    class="popover"
  >
    <template #content>
      <p
        class="levelPwdStrong"
        v-if="level === PASSWORD_STRENGTH.STRONG"
      >
        {{ t('levelPasswordStrengthStrong') }}
      </p>
      <p
        class="levelPwdAverage"
        v-if="level === PASSWORD_STRENGTH.AVERAGE"
      >
        {{ t('levelPasswordStrengthAverage') }}
      </p>
      <p
        class="levelPwdWeak"
        v-if="level === PASSWORD_STRENGTH.WEAK"
      >
        {{ t('levelPasswordStrengthWeak') }}
      </p>
      <p class="conditionPassword">
        {{ t('conditionValidPassword') }}
      </p>
      <p class="groupCondition">
        {{ t('4groupsCondition') }}
      </p>
    </template>
    <slot />
  </PPopover>
</template>

<!-- eslint-disable max-len -->
<i18n lang="yaml">
  en-US:
    popupTitle: 'Password strength level :'
    levelPasswordStrengthStrong: 'Strong'
    levelPasswordStrengthAverage: 'Average'
    levelPasswordStrengthWeak: 'Weak'
    conditionValidPassword: 'Password must contain at least 8 characters in total and 4 of the following :'
    4groupsCondition: 'an uppercase letter, a lowercase letter, a number, a special character'
  fr-FR:
    popupTitle: 'Niveau de sécurité du mot de passe :'
    levelPasswordStrengthStrong: 'Fort'
    levelPasswordStrengthAverage: 'Moyen'
    levelPasswordStrengthWeak: 'Faible'
    conditionValidPassword: 'Le mot de passe doit contenir au moins de 8 caractères au total et 4 parmi ce qui suit:'
    4groupsCondition: 'une lettre majuscule, une lettre minuscule, un chiffre, un caractère spéciale'
</i18n>
<!-- eslint-enable max-len -->

<script lang="ts" setup>
import { PPopover } from '@kpmg/styleguide'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PASSWORD_STRENGTH,
  levelPasswordStrength
} from '@/utils/passwordStrength'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps(['password'])

const level = computed(() => {
  return levelPasswordStrength(props.password)
})
</script>

<style lang="scss">
.el-popper.el-popover.is-light {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  min-width: 320px;

  .conditionPassword {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  .groupCondition {
    font-size: 12px;
    line-height: 14px;
  }

  .levelPwdStrong {
    color: var(--el-color-functionnal-green);
  }

  .levelPwdAverage {
    color: var(--el-color-functionnal-orange);
  }
  .levelPwdWeak {
    color: var(--el-color-functionnal-red);
  }
}
</style>
