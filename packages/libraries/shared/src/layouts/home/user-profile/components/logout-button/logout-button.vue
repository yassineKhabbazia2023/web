<template>
  <PButton
    v-if="variant === 'desktop'"
    pType="secondary"
    pPlain
    @click="handleLogout"
  >
    {{ t('logout') }}
  </PButton>

  <button
    v-else-if="variant === 'mobile'"
    type="button"
    class="
      logout-button--mobile
      flex
      flex--align-items-center
      flex-gap--2
      padding-y--2
      padding-x--4
      font-small
      font-semibold
    "
    @click="handleLogout"
  >
    <PIcon
      pName="power"
      class="logout-button--mobile__icon"
    />
    {{ t('logout') }}
  </button>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { useLogout } from '@pulse/shared/composables'
import type { LogoutButtonProps } from './logout-button.type'

withDefaults(defineProps<LogoutButtonProps>(), {
  variant: 'desktop',
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { handleLogout } = useLogout()
</script>

<style lang="scss" scoped>
.logout-button--mobile {
  background: none;
  border: none;
  color: var(--p-red-500);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &__icon {
    color: var(--p-red-500);
  }
}
</style>

<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>
