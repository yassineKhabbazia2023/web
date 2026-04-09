<template>
  <div class="flex flex--direction-column">
    <BookingConfirmationStatusComponent
      :status="confirmationStatus"
      class="stagger-fade-up"
    />
    <BookingShareLink
      v-if="confirmationStatus === BookingConfirmationStatus.SUCCESS"
      :bookingUrl="bookingUrl"
      class="margin-top--6 stagger-fade-up"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BookingConfirmationStatusComponent from './booking-confirmation-status.vue'
import BookingShareLink from './booking-share-link.vue'
import { BookingConfirmationStatus } from './booking-confirmation.enums'
import type { BookingConfirmationProps } from './booking-confirmation.types'

const props = defineProps<BookingConfirmationProps>()

const confirmationStatus = computed(() => {
  return props.isSubmitting
    ? BookingConfirmationStatus.LOADING
    : BookingConfirmationStatus.SUCCESS
})
</script>
