<template>
  <div
    v-if="FeatureFlagManager.isCustomerBookingActivated()"
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
        :pColor="AppColors.PRIMARY"
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
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { AppColors } from '@pulse/styleguide'
import { PIcon, PButton } from '@pulse/styleguide/components'
import { useBookingCustomerStore } from '../../../stores'
import BookingAppointmentNoResult from '../../components/no-result/booking-appointment-no-result.vue'
import BookingAppointmentDrawer from '../../components/appointment-drawer/booking-appointment-drawer.vue'
import { FeatureFlagManager } from '@pulse/common/managers'

const customerStore = useBookingCustomerStore()
const { isAppointmentDrawerOpen } = storeToRefs(customerStore)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

function onClickTakeAppointment() {
  customerStore.openAppointmentDrawer()
}
</script>


<i18n lang="yaml">
  en-US:
    title: 'Appointment with your expert'
    takeAppointment: 'Book appointment'
  fr-FR:
    title: 'Rendez-vous avec votre expert'
    takeAppointment: 'Prendre rendez-vous'
</i18n>
