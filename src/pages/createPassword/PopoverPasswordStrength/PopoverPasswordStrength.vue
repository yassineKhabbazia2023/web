<template>
  <PPopover
    placement="top"
    :disabled="false"
    :title="t('popupTitle')"
    trigger="click"
    showArrow
    popperClass="pwdPopover"
  >
    <template #content>
      <p
        :class="levelPasswordStrengthClass.class"
        class="levelPassword"
      >
        {{  levelPasswordStrengthClass.text }}
      </p>
      <p class="conditionPassword">
        {{ t('conditionValidPassword') }}
      </p>
      <p class="groupCondition">
        {{ t('groupsCharacter') }}
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
    groupsCharacter: 'an uppercase letter, a lowercase letter, a number, a special character'
  fr-FR:
    popupTitle: 'Niveau de sécurité du mot de passe :'
    levelPasswordStrengthStrong: 'Fort'
    levelPasswordStrengthAverage: 'Moyen'
    levelPasswordStrengthWeak: 'Faible'
    conditionValidPassword: 'Le mot de passe doit contenir au moins 8 caractères au total et 4 parmi ce qui suit: '
    groupsCharacter: 'une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial'
</i18n>
<!-- eslint-enable max-len -->

<script lang="ts" setup>
import { PPopover } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  PASSWORD_STRENGTH,
  levelPasswordStrength
} from './passwordStrength'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps(['password'])

const levelPasswordStrengthClass = computed(() => {
  const level = levelPasswordStrength(props.password)
  switch (level) {
    case PASSWORD_STRENGTH.STRONG:
      return { class: 'levelPwdStrong', text: t('levelPasswordStrengthStrong') }
    case PASSWORD_STRENGTH.AVERAGE:
      return { class: 'levelPwdAverage', text: t('levelPasswordStrengthAverage') }
    default:
      return { class: 'levelPwdWeak', text: t('levelPasswordStrengthWeak') }
  }
})
</script>

<style lang="scss">
.el-popper.el-popover.is-light.pwdPopover {
  min-width: 340px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;

  .el-popover__title {
    margin-bottom: 0;
  }

  .conditionPassword,
  .groupCondition {
    font-size: 12px;
    line-height: 14px;
  }

  .conditionPassword {
    font-weight: 400;
  }

  .levelPassword {
    margin-bottom: 8px;

    &.levelPwdStrong {
      color: var(--el-color-functionnal-green);
    }
    &.levelPwdAverage {
      color: var(--el-color-functionnal-orange);
    }
    &.levelPwdWeak {
      color: var(--el-color-functionnal-red);
    }
  }
}
</style>
