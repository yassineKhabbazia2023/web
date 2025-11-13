<template>
  <div
    data-testid="booking-appointment-no-result"
    class="
      flex
      flex--direction-column
      flex--align-items-center
      flex--justify-content-center
      flex--grow-1
      flex-gap--3
      text-color--neutral-gray-900
    "
  >
    <PIcon
      pName="calendarNone"
      pSize="40"
    />
    <span
      class="
        text-center
        max-width-300
      "
    >
      {{ t('message') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
  en-US:
    message: >
      No appointments are currently scheduled.
      Book an appointment with your expert whenever you want.
  fr-FR:
    message: >
      Aucun rendez-vous programmé actuellement.
      Prenez rendez-vous avec votre expert quand vous le souhaitez.
</i18n>
