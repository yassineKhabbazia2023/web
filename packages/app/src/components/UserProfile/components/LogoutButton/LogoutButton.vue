<template>
  <PButton
    pType="secondary"
    pPlain
    @click="handleLogout"
  >
    {{ t('logout') }}
  </PButton>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { amplitudeService, commonStore as useStore } from '@pulse/common'
import { PButton } from '@pulse/styleguide/components'
import { LoginRouteName } from '@pulse/common/constants'

const store = useStore()
const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const handleLogout = async () => {
  const isCollab = store.isCollab
  try {
    await store.logout(store.$state)
    amplitudeService.track('Sign Out Completed', {
      sign_out_result: 'succeeded',
    })
  } catch {
    amplitudeService.track('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  }
  localStorage.removeItem('selected-entity')
  const name = isCollab ? LoginRouteName.LOGIN_COLLAB : LoginRouteName.LOGIN_CLIENT
  router.push({ name })
}
</script>

<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>
