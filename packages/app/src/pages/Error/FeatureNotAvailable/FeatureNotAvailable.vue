<template>
  <PError
    :pDescription="t('description')"
    :pErrorName="t('errorName')"
    :pErrorText="t('errorText')"
    :pHasFooter="false"
    pIllustrationName="error-page-3"
    :pTitle="(t('title'))"
    @handle-click="redirectToHome"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PError } from '@pulse/styleguide/components'
import { useRedirection } from '@app/composables/useRedirection'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const { redirectToHome } = useRedirection()
</script>

<i18n lang="yaml">
en-US:
  title: 'This feature is no longer availaible'
  description: 'We are constantly working to improve your platform and add new features that meet your needs. We will keep you informed about upcoming updates !'
fr-FR:
  title: 'Cette fonctionnalité n’est plus disponible'
  description: 'Nous travaillons constamment à l’amélioration de votre plateforme et à l’ajout de nouvelles fonctionnalités qui répondent à vos besoins. Nous vous tiendrons informé des nouveautés à venir ! '
</i18n>
