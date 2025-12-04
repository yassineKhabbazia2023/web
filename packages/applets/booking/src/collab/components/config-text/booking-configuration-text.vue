<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--4
    "
  >
    <i18n-t
      keypath="configure"
      tag="p"
    >
      <template #microsoftBookings>
        <span
          class="font-semibold"
        >
          {{ t('microsoftBookings') }}
        </span>
      </template>
    </i18n-t>
    <p>{{ t('result') }}</p>
    <ul class="list-style-none">
      <li>
        <i18n-t
          keypath="access"
        >
          <template #microsoftBookings>
            <a
              :href="sanitizedBookingConfurationLink"
              class="
                font-semibold
                text-underline
              "
              target="_blank"
            >
              {{ t('microsoftBookings') }}
            </a>
          </template>
        </i18n-t>
      </li>
      <li>{{ t('define') }}</li>
      <li>{{ t('copyLink') }}</li>
    </ul>
    <p>
      <span class="font-semibold">{{ t('goodToKnow') }} :&nbsp;</span>
      <span>{{ t('youCanUpdate') }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { useI18n } from 'vue-i18n'
import { BOOKING_CONFIGURATION_LINK } from './booking-configuration-text .const'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const sanitizedBookingConfurationLink = sanitizeUrl(BOOKING_CONFIGURATION_LINK)
</script>

<i18n lang="yaml">
  en-US:
    title: 'Simplify appointment booking with your clients'
    configure: >
      Configure your {microsoftBookings} link to allow your clients to directly choose
      an available time slot in your calendar.
    result: 'Result: fewer back-and-forths, more efficiency, and smooth organization.'
    microsoftBookings: 'Microsoft Bookings'
    access: '1. Access {microsoftBookings} to create an appointment booking link'
    define: '2. Define your available days and hours'
    copyLink: '3. Copy the Microsoft Booking link into the box below'
    goodToKnow: 'Good to know'
    youCanUpdate: >
      You can update your availability at any time in Microsoft Bookings.
      Changes are automatically applied and visible to your clients.
  fr-FR:
    configure: >
      Configurez votre lien {microsoftBookings} pour permettre
      à vos clients de choisir directement un créneau disponible dans votre agenda.
    result: 'Résultat : moins d’allers-retours, plus d’efficacité et une organisation fluide.'
    microsoftBookings: 'Microsoft Bookings'
    access: '1. Accéder à {microsoftBookings} pour créer un lien de prise de rendez-vous'
    define: '2. Définissez vos jours et horaires de disponibilité'
    copyLink: '3. Copiez le lien Microsoft Booking dans l’encart ci-dessous'
    goodToKnow: 'Bon à savoir'
    youCanUpdate: >
      Vous pouvez modifier vos disponibilités à tout moment dans Microsoft Bookings.
      Les changements sont automatiquement appliqués et visibles par vos clients.
</i18n>
