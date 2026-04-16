<template>
  <div>
    <Teleport to="body">
      <BookingAppointmentsListDrawer
        v-model="isBookingAppointmentsListDrawerOpen"
        isCollaborator
        :upcomingAppointments="upcomingAppointments"
        :pastAppointments="pastAppointments"
        :isLoadingUpcoming="isLoadingUpcomingAppointments"
        :isLoadingPast="isLoadingPastAppointments"
        @take-appointment="onTakeAppointment"
        @open-booking-config="onOpenBookingConfig"
        @edit-booking-config="onEditBookingConfig"
        @tab-changed="onTabChanged"
      />
      <BookingDrawer
        v-if="hasBookingCreationDrawerBeenOpened"
      />
      <BookingAppointmentDrawer
        v-model:isOpened="isBookingAppointmentDrawerOpen"
      />
      <BookingEditDrawer />
    </Teleport>

    <PButton
      pSize="small"
      pIconOnly
      pPlain
      data-testid="booking-button"
      class="position--relative"
      @click="openAppointmentsDrawer"
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
import { nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PButton, PIcon, PPastille } from '@pulse/styleguide/components'
import { useBookingAppointmentsStore } from '@booking/stores'
import { useBookingCollabStore } from '@pulse/common/stores'
import BookingAppointmentsListDrawer from '@booking/shared/components/booking-appointments-drawer/booking-appointments-drawer.vue'
import BookingDrawer from '../../components/booking-drawer/booking-drawer.vue'
import BookingAppointmentDrawer from '../../../customer/components/appointment-drawer/booking-appointment-drawer.vue'
import BookingEditDrawer from '../../components/booking-edit-drawer/booking-edit-drawer.vue'
import { useBookingHeader } from '../../composables/use-booking-header.composable'
import { useDisplayCount } from '@booking/shared/composables/use-display-count.composable'
import { AppointmentTab } from '@booking/types'
import { BookingSourceEvent } from '@booking/services/booking-tracking.enum'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'

const appointmentsStore = useBookingAppointmentsStore()
const collabStore = useBookingCollabStore()

const {
  upcomingAppointments,
  pastAppointments,
  upcomingAppointmentsCount,
  isLoadingUpcomingAppointments,
  isLoadingPastAppointments,
  isBookingAppointmentsListDrawerOpen,
  isBookingAppointmentDrawerOpen,
  hasUpcomingAppointments,
} = storeToRefs(appointmentsStore)

const {
  hasBookingCreationDrawerBeenOpened,
  openDrawer: openBookingConfigDrawer,
} = useBookingHeader()

const { displayCount } = useDisplayCount(upcomingAppointmentsCount)

function openAppointmentsDrawer() {
  appointmentsStore.openBookingAppointmentsListDrawer()
  appointmentsStore.fetchUpcomingAppointments()

  BookingTrackingService.trackBookingConsulted()
}

function onTakeAppointment() {
  appointmentsStore.closeBookingAppointmentsListDrawer()
  appointmentsStore.openBookingAppointmentDrawer()
}

function onOpenBookingConfig() {
  appointmentsStore.closeBookingAppointmentsListDrawer()
  openBookingConfigDrawer()
}

async function onEditBookingConfig(configurationId: number) {
  appointmentsStore.closeBookingAppointmentsListDrawer()
  await nextTick()
  collabStore.openBookingEditDrawer(configurationId)
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
  appointmentsStore.fetchUpcomingAppointmentsCount()
})
</script>

<style lang="scss" scoped>
.header-section__x-small-pastille {
  right: 0;
  top: 0;
}
</style>
