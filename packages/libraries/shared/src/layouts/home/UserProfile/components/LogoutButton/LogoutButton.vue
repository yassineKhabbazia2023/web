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
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { PButton } from '@pulse/styleguide/components'
import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'

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
    AmplitudeService.track('Sign Out Completed', {
      sign_out_result: 'succeeded',
    })
  } catch {
    AmplitudeService.track('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  }
  const routeName = isCollab ? RouteName.LOGIN_COLLAB : RouteName.LOGIN_CLIENT
  // give some time for the logout process to complete before navigating
  // especially for amplitude events to be sent before the user context is lost
  setTimeout(() => {
    router.push({ name: routeName })
  }, 250)
}
</script>

<i18n lang="yaml">
en-US:
  logout: 'Logout'
fr-FR:
  logout: 'Se déconnecter'
</i18n>
