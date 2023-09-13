<template>
  <h3>{{ t('title') }}</h3>
</template>

<i18n lang="yaml">
  en-US:
    title: 'This is the createPassword page'
  fr-FR:
    title: 'Ceci est la page de créer mdp'
</i18n>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { commonApi } from '@kpmg/common'
import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const route = useRoute()
const router = useRouter()

const isValidToken = async (): Promise<any> => {
  const token = route.query.pwrt
  const urlValidToken = `/Activation/IsInvitationTokenValid?invitationToken=${token}`
  try {
    const { data: value } = await commonApi().onboarding.get(urlValidToken)
    return value
  } catch {}
}
onBeforeMount(async () => {
  const contactId = route.query.contactId
  const accountId = route.query.accountid
  const isValid = await isValidToken()
  if (!isValid) {
    router.push({ path: '/expireToken', query: { contactId, accountId } })
  }
})
</script>
