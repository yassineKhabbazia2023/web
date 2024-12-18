<template>
  <PError
    :pDescription="t('description')"
    pIllustrationName="error-page-3"
    pErrorName=""
    pErrorText=""
    :pTitle="t('title')"
  />
</template>

<script setup lang="ts">
import { PError } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
en-US:
  title: 'This functionality is no longer available'
  description: >
    We are constantly working to improve your platform and add new features that meet your needs.
    We will keep you informed of the new features to come!
fr-FR:
  title: "Cette fonctionnalité n'est plus disponible"
  description: >
    Nous travaillons constamment à l'amélioration de votre plateforme
    et à l'ajout de nouvelles fonctionnalités qui répondent à vos besoins.
    Nous vous tiendrons informé des nouveautés à venir !
</i18n>
