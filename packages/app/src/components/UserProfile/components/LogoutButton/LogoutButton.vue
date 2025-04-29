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
import { APP_ROUTES } from '@pulse/common/constants'
import { amplitudeService } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
import { PButton } from '@pulse/styleguide/components'
import { CurrentUserManager } from '@pulse/common/managers'

const userStore = useUserStore()
const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const handleLogout = async () => {
  const isCollab = userStore.isCollab
  try {
    await CurrentUserManager.logout()
    amplitudeService.track('Sign Out Completed', {
      sign_out_result: 'succeeded',
    })
  } catch {
    amplitudeService.track('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  }
  const name = isCollab ? APP_ROUTES.login.collab.name : APP_ROUTES.login.client.name
  router.push({ name })
}
</script>

<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>
