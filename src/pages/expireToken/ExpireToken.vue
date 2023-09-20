<template>
  <div class="page-content">
    <PImage
      type="badges"
      name="lock"
      class="badge-lock hidden-md-and-up"
    />
    <p class="expireMsg">
      {{ t('expireMsg') }}
    </p>
    <p class="helpMsg">
      {{ t('helpMsg') }}
    </p>
    <PButton
      type="primary"
      size="large"
      class="btn-link"
      :loading="isLoading"
      @click="resendLink">
      {{ t('btnReceiveLink') }}
    </PButton>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    expireMsg: 'Unfortunately, your link expired...'
    helpMsg: 'Please click here to receive a new link by mail.'
    btnReceiveLink: 'Receive my link'
  fr-FR:
    expireMsg: 'Malheuresement, votre lien a expiré...'
    helpMsg: 'Cliquez ici afin de recevoir un nouveau lien par mail.'
    btnReceiveLink: 'Recevoir mon lien'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commonApi } from '@kpmg/common'
import { PImage, PButton } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const route = useRoute()
const router = useRouter()
const isLoading = ref()
const resendLink = async () => {
  const email = route.query.email
  const accountId = route.query.accountId
  try {
    const urlResendLink = `/Activation/Invite?accountId=${accountId}&email=${email}`
    isLoading.value = true
    await commonApi().onboarding.post(urlResendLink)
    isLoading.value = false
    router.push({ path: '/resendEmailSuccess' })
  } catch {}
}
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (min-width: 992px) {
    padding: 0 0 48px 0;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  text-align: left;
  justify-content: space-evenly;
  gap: 24px;

  .expireMsg {
    font-weight: 600;
    font-size: 16px;
    line-height: 19.2px;
  }

  .btn-link {
    width: 100%;
  }

  .badge-lock {
    max-width: 105px;
    margin:auto;
  }
}
</style>
