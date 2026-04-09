<template>
  <div
    :class="[
      'booking-confirmation-status',
      `bg--${statusBackgroundColor}`,
      'flex',
      'flex--direction-column',
      'flex--align-items-center',
      'flex--justify-content-center',
      'padding-y--10',
      'padding-x--6',
      'text-center',
    ]"
  >
    <div class="booking-confirmation-status__icon">
      <PLoader
        v-if="status === BookingConfirmationStatus.LOADING"
        pType="gradient"
        pSize="48"
      />
      <PIcon
        v-else
        pName="circleCheckDuotone"
        pSize="48px"
        class="booking-confirmation-status__success-icon"
      />
    </div>
    <h2 class="h2 margin-y--4">
      {{ t(`booking-confirmation.${status}.title`) }}
    </h2>
    <p class="font-large font-normal">
      {{ t(`booking-confirmation.${status}.subtitle`) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PIcon, PLoader } from '@pulse/styleguide/components'
import { BookingConfirmationStatus } from './booking-confirmation.enums'
import type { BookingConfirmationStatusProps } from './booking-confirmation.types'

const props = defineProps<BookingConfirmationStatusProps>()

const { t } = useI18n({ useScope: 'global' })

const statusBackgroundColor = computed(() => {
  return props.status === BookingConfirmationStatus.LOADING
    ? 'black-rock-100'
    : 'green-100'
})
</script>

<style scoped>
.booking-confirmation-status {
  border-radius: var(--p-radius-2);
}

.booking-confirmation-status__success-icon {
  animation: success-pop 0.4s ease-out forwards;
}
</style>
