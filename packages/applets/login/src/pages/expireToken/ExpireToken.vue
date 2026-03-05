<template>
  <div class="page-content">
    <p
      class="expireMsg"
      data-testid="expire-token-message"
    >
      {{ t('expireMsg') }}
    </p>
    <p
      class="helpMsg"
      data-testid="expire-token-help-message"
    >
      {{ t('helpMsg') }}
    </p>
    <PButton
      pType="primary"
      pSize="default"
      class="btn-link"
      :pLoading="isLoading"
      data-testid="expire-token-resend-button"
      @click="resendLink"
    >
      {{ t('btnReceiveLink') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import { RouteName } from '@pulse/common/enums'
import { PButton } from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const route = useRoute()
const router = useRouter()
const isLoading = ref()
const resendLink = async () => {
  const { contactId, contactEmail, accountNumber } = route.query
  try {
    isLoading.value = true
    if (contactEmail) {
      const email = contactEmail.toString().trim().replace(' ', '+')
      await api.gateway.post('authentication/api/sendResetPasswordLink', { email })
    } else {
      await api.gateway.post(`account/api/customers/invite/${contactId}`, null, { params: { accountNumber } })
    }
    router.push({ name: RouteName.RESEND_EMAIL_SUCCESS })
  } catch (error) {
    logger.error(error)
    PNotification({
      message: t('technicalErrorMessage'),
      iconName: 'x',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  margin: auto;
  height: 100%;
  padding-bottom: 12px;
  text-align: left;

  @media (min-width: 992px) {
    padding: 48px 0 0 0;
    text-align: center;
  }

  .expireMsg {
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

<i18n lang="yaml">
  en-US:
    expireMsg: 'Unfortunately, your link expired...'
    helpMsg: 'Please click here to receive a new link by mail.'
    btnReceiveLink: 'Receive my link'
    technicalErrorMessage: 'A technical error has occurred. Please try again in a few moments.'
  fr-FR:
    expireMsg: 'Malheureusement, votre lien a expiré...'
    helpMsg: 'Cliquez ici afin de recevoir un nouveau lien par mail.'
    btnReceiveLink: 'Recevoir mon lien'
    technicalErrorMessage: 'Une erreur technique est survenue. Veuillez réessayer dans quelques instants.'
</i18n>
