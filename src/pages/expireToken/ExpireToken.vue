<template>
  <div class="page-content">
    <PImage
      pType="badges"
      pName="x"
      class="badge-lock hidden-md-and-up"
    />
    <p class="expireMsg">
      {{ t('expireMsg') }}
    </p>
    <p class="helpMsg">
      {{ t('helpMsg') }}
    </p>
    <PButton
      pType="primary"
      pSize="default"
      class="btn-link"
      :pLoading="isLoading"
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
    expireMsg: 'Malheureusement, votre lien a expiré...'
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
  let { contactId, contactEmail, accountId } = route.query
  try {
    isLoading.value = true
    contactEmail && (contactEmail = contactEmail.toString().trim().replace(' ', '+'))
    contactEmail
      ? await commonApi().auth.post('/sendResetPasswordLink', { email: contactEmail })
      // eslint-disable-next-line max-len
      : await commonApi().onboarding.post(`/Activation/Invite?accountId=${accountId}&contactId=${contactId}`)
    isLoading.value = false
    router.push({ path: '/resendEmailSuccess' })
  } catch {}
}
</script>

<style lang="scss" scoped>
.page-content {
  margin: auto;
  height: 100%;
  @media (min-width: 992px) {
    padding: 0 0 48px 0;
    text-align: center;
  }
  text-align: left;

  .expireMsg {
    @media (min-width: 992px) {
      margin-top: 166px;
    }
    margin-top: 34px;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
  }

  .helpMsg {
    margin-top: 16px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
  }

  .btn-link {
    width: 100%;
    margin-top: 24px;
    @media (min-width: 992px) {
      margin-bottom: 220px;
    }
  }

  .badge-lock {
    max-width: 105px;
    display: block;
    margin:auto;
  }
}
</style>
