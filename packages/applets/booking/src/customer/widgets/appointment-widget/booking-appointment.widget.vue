<template>
  <div
    v-if="isBookingEnabled"
    class="
      flex
      flex--direction-column
      height--100
    "
  >
    <Teleport to="body">
      <BookingAppointmentDrawer
        v-model:isOpened="isBookingAppointmentDrawerOpen"
      />
    </Teleport>

    <div class="flex flex--align-items-center">
      <PIcon
        pName="pulse"
        :pColor="AppColors.JUNGLE_400"
        pSize="30"
      />
      <span class="h3 margin-left--1 font-semibold">
        {{ t('title') }}
      </span>
    </div>

    <div class="flex--grow-1 margin-top--3">
      <PLoader v-if="isInitialLoading" pSize="36" />
      <template v-else-if="hasUpcomingAppointments">
        <PTabs
          v-model="activeTab"
        >
          <PTabPane
            :label="t('tabs.upcoming')"
            :name="AppointmentTab.UPCOMING"
          >
            <div
              v-if="isLoadingUpcoming"
              class="flex flex--justify-content-center padding--4"
            >
              <PLoader pSize="36" />
            </div>
            <div
              v-else
              class="flex flex--direction-column flex-gap--2"
            >
              <PAppointmentCard
                v-for="appointment in localUpcomingAppointments"
                :key="appointment.id"
                :pStartDateTime="appointment.startDateTime"
                :pLabel="getAppointmentLabel(appointment)"
                :pIsOnlineMeeting="appointment.isOnlineMeeting"
                :pJoinLabel="t('join')"
                :pIsActive="isAppointmentActive(appointment)"
                @join="onJoinMeeting(appointment)"
              />
            </div>
          </PTabPane>
          <PTabPane
            :label="t('tabs.past')"
            :name="AppointmentTab.PAST"
          >
            <div
              v-if="isLoadingPast"
              class="flex flex--justify-content-center padding--4"
            >
              <PLoader pSize="36" />
            </div>
            <div
              v-else-if="hasPastAppointments"
              class="flex flex--direction-column flex-gap--2"
            >
              <PAppointmentCard
                v-for="appointment in localPastAppointments"
                :key="appointment.id"
                :pStartDateTime="appointment.startDateTime"
                :pLabel="getAppointmentLabel(appointment)"
                :pIsOnlineMeeting="appointment.isOnlineMeeting"
                :pJoinLabel="t('join')"
                :pIsActive="false"
              />
            </div>
            <NoAppointmentsPlaceholder
              v-else
              :message="t('noPast')"
            />
          </PTabPane>
        </PTabs>
      </template>
      <div
        v-else
        class="
          flex
          flex--direction-column
          flex--align-items-center
          flex--justify-content-center
          height--100
          text-align--center
        "
      >
        <PIcon
          pName="calendarDuotone"
          pSize="24"
          class="color--gray-400"
        />
        <p class="font-large margin-y--4">
          {{ t('noUpcoming') }}
        </p>
        <p class="text-color--gray-400 margin-bottom--4 text-center">
          {{ t('noUpcomingDescription') }}
        </p>
        <PButton
          pType="secondary"
          pSize="small"
          pTestId="booking-schedule-appointment-button"
          @click="onClickScheduleAppointment"
        >
          {{ t('scheduleAppointment') }}
          <PIcon
            pName="calendarPlus"
            pSize="16"
            class="margin-left--2"
          />
        </PButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { AppColors } from '@pulse/styleguide'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { PIcon, PButton, PAppointmentCard, PLoader, PTabs, PTabPane } from '@pulse/styleguide/components'
import { useBookingAppointmentsStore, useBookingCustomerStore } from '@booking/stores'
import type { AppointmentResponse } from '@booking/types'
import { AppointmentTab } from '@booking/types'
import { BookingService } from '@booking/services'
import BookingAppointmentDrawer from '@booking/customer/components/appointment-drawer/booking-appointment-drawer.vue'
import NoAppointmentsPlaceholder from '@booking/shared/components/booking-appointments-drawer/components/no-appointments-placeholder.vue'
import { MAX_APPOINTMENTS_DISPLAY } from '@booking/constants'
import { BookingSourceEvent } from '@booking/services/booking-tracking.enum'

const appointmentsStore = useBookingAppointmentsStore()
const customerStore = useBookingCustomerStore()
const { isBookingAppointmentDrawerOpen } = storeToRefs(appointmentsStore)

const localUpcomingAppointments = ref<AppointmentResponse[]>([])
const localPastAppointments = ref<AppointmentResponse[]>([])
const isLoadingUpcoming = ref(false)
const isLoadingPast = ref(false)

const activeTab = ref(AppointmentTab.UPCOMING)

const isBookingEnabled = computed(() => customerStore.getIsBookingEnabled())
const isInitialLoading = computed(() => isLoadingUpcoming.value && localUpcomingAppointments.value.length === 0)
const hasUpcomingAppointments = computed(() => localUpcomingAppointments.value.length > 0)
const hasPastAppointments = computed(() => localPastAppointments.value.length > 0)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      title: 'Your scheduled appointments',
      join: 'Join',
      appointmentWith: 'Appointment with {name}',
      tabs: {
        upcoming: 'Upcoming',
        past: 'Past',
      },
      noUpcoming: 'No upcoming appointments',
      noUpcomingDescription: 'Have a question, a roadblock, or want to make progress on a topic? Your experts are available to assist you.',
      noPast: 'No past appointments',
      scheduleAppointment: 'Schedule an appointment',
    },
    'fr-FR': {
      title: 'Vos rendez-vous planifiés',
      join: 'Rejoindre',
      appointmentWith: 'RDV avec {name}',
      tabs: {
        upcoming: 'A venir',
        past: 'Passés',
      },
      noUpcoming: 'Aucun rendez-vous à venir',
      noUpcomingDescription: 'Vous avez une question, un blocage ou envie d\'avancer sur un sujet ? Vos experts sont disponibles pour vous accompagner.',
      noPast: 'Aucun rendez-vous passé',
      scheduleAppointment: 'Planifier un rendez-vous',
    },
  },
})

async function fetchWidgetUpcomingAppointments() {
  isLoadingUpcoming.value = true
  try {
    localUpcomingAppointments.value = await BookingService.getUpcomingAppointments(MAX_APPOINTMENTS_DISPLAY)
  } catch (error) {
    logger.error(error)
    localUpcomingAppointments.value = []
  } finally {
    isLoadingUpcoming.value = false
  }
}

async function fetchWidgetPastAppointments() {
  isLoadingPast.value = true
  try {
    localPastAppointments.value = await BookingService.getPastAppointments(MAX_APPOINTMENTS_DISPLAY)
  } catch (error) {
    logger.error(error)
    localPastAppointments.value = []
  } finally {
    isLoadingPast.value = false
  }
}

function getAppointmentLabel(appointment: AppointmentResponse): string {
  return t('appointmentWith', { name: appointment.counterpartName })
}

function isAppointmentActive(appointment: AppointmentResponse): boolean {
  const now = new Date()
  const appointmentStart = new Date(appointment.startDateTime)
  return appointmentStart >= now
}

function onJoinMeeting(appointment: AppointmentResponse) {
  if (appointment.joinWebUrl !== null) {
    window.open(appointment.joinWebUrl, '_blank')
    BookingTrackingService.trackMeetingJoinRequested(BookingSourceEvent.HOME)
  }
}

function onClickScheduleAppointment() {
  appointmentsStore.openBookingAppointmentDrawer()

  BookingTrackingService.trackCustomerBookingFlowStarted()
  BookingTrackingService.trackBookingConsulted(BookingSourceEvent.HOME)
}

watch(activeTab, (newTab) => {
  if (newTab === AppointmentTab.PAST) {
    fetchWidgetPastAppointments()
    BookingTrackingService.trackPastMeetingsConsulted()
  } else if (newTab === AppointmentTab.UPCOMING) {
    fetchWidgetUpcomingAppointments()
    BookingTrackingService.trackBookingMeetingConsulted(BookingSourceEvent.HOME)
  }
})

onMounted(() => {
  if (isBookingEnabled.value) {
    fetchWidgetUpcomingAppointments()
  }
})
</script>
