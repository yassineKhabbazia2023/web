<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--4
    "
  >
    <p>{{ t('success') }}</p>
    <p>{{ t('yourCustomers') }}</p>
    <div>
      <p class="font-semibold">
        {{ t('tips') }}
      </p>
      <ul
        class="
          list-style-none
          margin-left--2
        "
      >
        <li>{{ t('youCanUpdate') }}</li>
        <li>{{ t('youCanDesactivate') }}</li>
      </ul>
    </div>
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
    success: 'Your Microsoft Bookings link has been successfully saved.'
    yourCustomers: 'Your customers can now directly book an available slot in your calendar.'
    tips: 'Tip:'
    youCanUpdate: >
      • You can update your availability at any time from Microsoft Bookings.
    youCanDesactivate: >
      • You can also disable appointment booking by reopening
      the configuration window and disabling access for your customers.
  fr-FR:
    success: 'Votre lien Microsoft Bookings a été enregistré avec succès.'
    yourCustomers: 'Vos clients peuvent désormais réserver directement un créneau disponible dans votre agenda.'
    tips: 'Astuce :'
    youCanUpdate: >
      • Vous pouvez modifier vos disponibilités à tout moment depuis Microsoft Bookings.
    youCanDesactivate: >
      • Vous pouvez aussi désactiver la prise de rendez-vous en rouvrant
      la fenêtre de configuration et en désactivant l’accès à vos clients.
</i18n>
