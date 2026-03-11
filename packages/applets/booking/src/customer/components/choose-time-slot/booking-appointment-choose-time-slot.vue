<template>
  <div class="booking-appointment-choose-time-slot margin-top--4">
    <PLoader v-if="isLoading" />
    <iframe
      v-else
      :src="iframeUrl"
      class="
        height--100
        width--100
      "
      frameborder="0"
    />
  </div>
</template>

<script setup lang="ts">
import { PLoader } from '@pulse/styleguide/components'
import type { BookingAppointmentChooseTimeSlotProps } from './booking-appointment-choose-time-slot.types'
import { useBookingAppointmentChooseTimeSlot } from './booking-appointment-choose-time-slot.composable'

const props = defineProps<BookingAppointmentChooseTimeSlotProps>()

const { iframeUrl, isLoading } = useBookingAppointmentChooseTimeSlot(props.collaboratorId)
</script>

<style scoped>
.booking-appointment-choose-time-slot {
  height: calc(100vh - 150px);
}
</style>
