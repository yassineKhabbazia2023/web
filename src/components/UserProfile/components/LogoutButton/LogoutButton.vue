<template>
  <PButton
    @click="handleLogout"
    class="margin-right--4"
    pType="primary"
    pPlain
  >
    {{ t('logout') }}
  </PButton>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { commonStore as useStore } from '@kpmg/common'
import { PButton } from '@kpmg/styleguide'

const store = useStore()
const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const handleLogout = async () => {
  await store.logout(store.$state)
  router.push({ name: 'login' })
}
</script>

<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>
