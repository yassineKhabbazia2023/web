<template>
  <div>
    <Teleport to="body">
      <BookingDrawer
        v-if="hasBookingDrawerBeenOpened"
        v-model:isOpened="isBookingDrawerOpened"
      />
      <BookingAppointmentDrawer
        v-model:isOpened="isOpenedBookingAppointmentDrawer"
      />
    </Teleport>

    <PButton
      pSize="small"
      pIconOnly
      pPlain
      :pDisabled="false"
      :pLoading="false"
      data-testid="booking-button"
      class="position--relative"
      @click="openDrawer"
    >
      <PIcon pName="calendarEvent" />
      <PPastille
        class="position--absolute header-section__x-small-pastille"
        pSize="x-small"
        pType="warning"
      />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { PButton, PIcon, PPastille } from '@pulse/styleguide/components'
import BookingDrawer from '../../components/config-drawer/booking-drawer.vue'
import BookingAppointmentDrawer from '../../../customer/components/appointment-drawer/booking-appointment-drawer.vue'
import { useBookingHeader } from '../../composables/use-booking-header.composable'

const {
  hasBookingDrawerBeenOpened,
  isBookingDrawerOpened,
  isOpenedBookingAppointmentDrawer,
  openDrawer,
} = useBookingHeader()
</script>

<style lang="scss" scoped>
.header-section__x-small-pastille {
  right: 1px;
  top: 0px;
}
</style>
