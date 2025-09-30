<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--4
    "
  >
    <p>{{ t('failed') }}</p>
    <p>{{ t('pleaseApologies') }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

</script>

<i18n lang="yaml">
  en-US:
    failed: 'A problem occurred, and your Microsoft Bookings link was not saved.'
    pleaseApologies: >
      We apologize and kindly ask you to try again in a few minutes.
      If the issue persists, please contact Employee Support for assistance.
  fr-FR:
    failed: 'Un problème est survenu et votre lien Microsoft Bookings n’a pas été enregistré.'
    pleaseApologies: >
      Nous vous prions de nous excuser et de réessayer dans quelques minutes.
      Si le problème persiste, contactez le Support Collaborateur afin d’être accompagné.
</i18n>
