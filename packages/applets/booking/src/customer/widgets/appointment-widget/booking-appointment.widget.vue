<template>
  <div
    v-if="isBookingEnabled === true"
    class="
        flex
        flex--direction-column
        height--100
        flex--justify-content-space-between
      "
  >
    <Teleport to="body">
      <BookingAppointmentDrawer
        v-model:isOpened="isAppointmentDrawerOpen"
      />
    </Teleport>

    <div
      class="
        flex
      "
    >
      <PIcon
        pName="pulse"
        :pColor="AppColors.JUNGLE_400"
        pSize="30"
      />
      <span class="h3 margin-left--1 font-semibold">
        {{ t('title') }}
      </span>
    </div>
    <div
      class="flex-grow-1"
    >
      <BookingAppointmentNoResult />
    </div>
    <div>
      <PButton
        class="
          el-button el-button--default
          el-button--small
          p-button
          p-button--secondary
        "
        @click="onClickTakeAppointment"
      >
        {{ t('takeAppointment') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { AppColors } from '@pulse/styleguide'
import { PIcon, PButton } from '@pulse/styleguide/components'
import { useBookingCustomerStore } from '@booking/stores'
import BookingAppointmentNoResult from '@booking/customer/components/no-result/booking-appointment-no-result.vue'
import BookingAppointmentDrawer from '@booking/customer/components/appointment-drawer/booking-appointment-drawer.vue'

const customerStore = useBookingCustomerStore()
const { isAppointmentDrawerOpen } = storeToRefs(customerStore)
const isBookingEnabled = computed(() => customerStore.getIsBookingEnabled() === true)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      title: 'Appointment with your expert',
      takeAppointment: 'Book appointment',
    },
    'fr-FR': {
      title: 'Rendez-vous avec votre expert',
      takeAppointment: 'Prendre rendez-vous',
    },
  },
})

function onClickTakeAppointment() {
  customerStore.openAppointmentDrawer()
}
</script>
