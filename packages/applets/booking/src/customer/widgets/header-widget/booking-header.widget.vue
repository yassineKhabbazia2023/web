<template>
  <div>
    <Teleport to="body">
      <BookingAppointmentsListDrawer
        v-model="isBookingAppointmentsListDrawerOpen"
        :upcomingAppointments="upcomingAppointments"
        :pastAppointments="pastAppointments"
        :isLoadingUpcoming="isLoadingUpcomingAppointments"
        :isLoadingPast="isLoadingPastAppointments"
        @take-appointment="onTakeAppointment"
        @tab-changed="onTabChanged"
      />
      <BookingAppointmentDrawer
        v-model:isOpened="isBookingAppointmentDrawerOpen"
      />
    </Teleport>

    <PButton
      pSize="small"
      pIconOnly
      pPlain
      data-testid="booking-customer-button"
      class="position--relative"
      @click="openDrawer"
    >
      <PIcon pName="calendarEvent" />
      <PPastille
        v-if="hasUpcomingAppointments"
        class="position--absolute header-section__x-small-pastille"
        pSize="small"
        pType="warning"
      >
        {{ displayCount }}
      </PPastille>
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PButton, PIcon, PPastille } from '@pulse/styleguide/components'
import { useBookingAppointmentsStore, useBookingCustomerStore } from '@booking/stores'
import BookingAppointmentsListDrawer from '@booking/shared/components/booking-appointments-drawer/booking-appointments-drawer.vue'
import BookingAppointmentDrawer from '@booking/customer/components/appointment-drawer/booking-appointment-drawer.vue'
import { useDisplayCount } from '@booking/shared/composables/use-display-count.composable'
import { AppointmentTab } from '@booking/types'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { BookingSourceEvent } from '@booking/services/booking-tracking.enum'

const appointmentsStore = useBookingAppointmentsStore()
const customerStore = useBookingCustomerStore()

const {
  upcomingAppointments,
  pastAppointments,
  upcomingAppointmentsCount,
  isLoadingUpcomingAppointments,
  isLoadingPastAppointments,
  isBookingAppointmentDrawerOpen,
  isBookingAppointmentsListDrawerOpen,
  hasUpcomingAppointments,
} = storeToRefs(appointmentsStore)

const { displayCount } = useDisplayCount(upcomingAppointmentsCount)

function openDrawer() {
  appointmentsStore.openBookingAppointmentsListDrawer()
  appointmentsStore.fetchUpcomingAppointments()

  BookingTrackingService.trackBookingConsulted(BookingSourceEvent.HEADER)
}

function onTakeAppointment() {
  appointmentsStore.closeBookingAppointmentsListDrawer()
  appointmentsStore.openBookingAppointmentDrawer()
  BookingTrackingService.trackConfigurationOpened(BookingSourceEvent.HEADER)
}

function onTabChanged(tab: string) {
  if (tab === AppointmentTab.PAST) {
    appointmentsStore.fetchPastAppointments()
    BookingTrackingService.trackPastMeetingsConsulted()
  } else if (tab === AppointmentTab.UPCOMING) {
    appointmentsStore.fetchUpcomingAppointments()
    BookingTrackingService.trackBookingMeetingConsulted(BookingSourceEvent.HEADER)
  }
}

onMounted(() => {
  if (customerStore.getIsBookingEnabled() === true) {
    appointmentsStore.fetchUpcomingAppointmentsCount()
  }
})
</script>

<style lang="scss" scoped>
.header-section__x-small-pastille {
  right: 0;
  top: 0;
}
</style>
