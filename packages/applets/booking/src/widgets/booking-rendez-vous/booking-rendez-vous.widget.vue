<template>
  <div
    class="
        flex
        flex--direction-column
        height--100
        flex--justify-content-space-between
      "
  >
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
      <BookingRendezVousNoResult />
    </div>
    <div>
      <PButton
        class="
          el-button el-button--default
          el-button--small
          p-button
          p-button--secondary
        "
        @click="onClickTakeRendezVous"
      >
        {{ t('takeRendezVous') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { PIcon, PButton } from '@pulse/styleguide/components'
import { useBookingStore } from '@pulse/common/stores'
import BookingRendezVousNoResult from '../../components/booking-rendez-vous-no-result/booking-rendez-vous-no-result.vue'

const bookingStore = useBookingStore()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

function onClickTakeRendezVous() {
  bookingStore.isOpenedBookingRendezVousDrawer = true
}
</script>


<i18n lang="yaml">
  en-US:
    title: 'Rendez-vous with your expert'
    takeRendezVous: 'Take rendez-vous'
  fr-FR:
    title: 'Rendez-vous avec votre expert'
    takeRendezVous: 'Prendre rendez-vous'
</i18n>
