<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('profileSettings')"
    pDirection="btt"
    pSize="100%"
    class="mobile-user-menu"
    data-testid="mobile-user-menu"
    @close-drawer-button="isDrawerOpened = false"
  >
    <div class="flex flex--direction-column">
      Placeholder
    </div>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isDrawerOpened = defineModel<boolean>('isDrawerOpened', { default: false })
</script>


<i18n lang="json">
{
  "en-US": {
    "profileSettings": "Profile settings"
  },
  "fr-FR": {
    "profileSettings": "Paramètres du profil"
  }
}
</i18n>
