<template>
  <PDrawer
    v-model="isBookingDrawerOpened"
    :pTitle="drawerTitle"
    pSize="33%"
    destroyOnClose
    @close-drawer-button="closeBookingDrawer"
  >
    <!-- This is the container of all booking flows drawer flows -->
    <BookingConfiguration
      :is-loading="isLoading"
      @update-title="updateDrawerTitle"
    />
    <template #footer>
      <div id="booking-drawer__footer" />
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { PDrawer } from '@pulse/styleguide/components'
import BookingConfiguration from '../booking-configuration/booking-configuration.vue'
import { useBookingDrawer } from './booking-drawer.composable'


const {
  drawerTitle,
  isBookingDrawerOpened,
  closeBookingDrawer,
  updateDrawerTitle,
  isLoading,
} = useBookingDrawer()
</script>
