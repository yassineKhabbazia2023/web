<template>
  <div class="booking-appointment-choose-time-slot margin-top--4">
    <iframe
      :src="BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl(iframeUrl)"
      class="
        height--100
        width--100
      "
      frameborder="0"
    />
  </div>
</template>

<script setup lang="ts">
import { BookingAppointmentChooseTimeSlotManager } from './booking-appointment-choose-time-slot.manager'
import type { BookingAppointmentChooseTimeSlotProps } from './booking-appointment-choose-time-slot.types'

defineProps<BookingAppointmentChooseTimeSlotProps>()
</script>

<style scoped>
.booking-appointment-choose-time-slot {
  height: calc(100vh - 150px);
}
</style>
