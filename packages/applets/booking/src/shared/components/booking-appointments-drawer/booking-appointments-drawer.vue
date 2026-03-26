<template>
  <PDrawer
    v-model="isDrawerOpened"
    class="booking-appointments-drawer"
    data-testid="booking-appointments-drawer"
    :pType="isMobile ? 'fullscreen' : 'mini'"
    :pTitle="t('title')"
    modal
    :pDirection="isMobile ? undefined : 'ttb'"
    destroyOnClose
    :pHeaderToolbox="showToolbox ? toolboxParams() : undefined"
    @close-drawer-button="closeDrawer"
    @p-toolbox-item-clicked="handleToolboxItemClick"
  >
    <div
      class="
        flex
        flex--direction-column
        height--100
      "
    >
      <div class="flex--grow-1">
        <PTabs v-model="activeTab">
          <PTabPane
            :label="t('tabs.upcoming')"
            :name="AppointmentTab.UPCOMING"
          >
            <div class="booking-appointments-drawer__content">
              <div
                v-if="isLoadingUpcoming"
                class="
                  flex
                  flex--align-items-center
                  flex--justify-content-center
                  height--100
                "
              >
                <PLoader pSize="28" />
              </div>
              <template v-else-if="hasUpcomingAppointments">
                <div class="flex flex--direction-column flex-gap--2">
                  <PAppointmentCard
                    v-for="appointment in upcomingAppointments"
                    :key="appointment.id"
                    :pStartDateTime="appointment.startDateTime"
                    :pLabel="getAppointmentLabel(appointment)"
                    :pIsOnlineMeeting="appointment.isOnlineMeeting"
                    :pJoinLabel="t('join')"
                    @join="onJoinMeeting(appointment)"
                  />
                </div>
              </template>
              <NoAppointmentsPlaceholder
                v-else
                :message="t('noUpcoming')"
              />
            </div>
          </PTabPane>

          <PTabPane
            :label="t('tabs.past')"
            :name="AppointmentTab.PAST"
          >
            <div class="booking-appointments-drawer__content">
              <div
                v-if="isLoadingPast"
                class="
                  flex
                  flex--align-items-center
                  flex--justify-content-center
                  height--100
                "
              >
                <PLoader pSize="28" />
              </div>
              <template v-else-if="hasPastAppointments">
                <div class="flex flex--direction-column flex-gap--2">
                  <PAppointmentCard
                    v-for="appointment in pastAppointments"
                    :key="appointment.id"
                    :pStartDateTime="appointment.startDateTime"
                    :pLabel="getAppointmentLabel(appointment)"
                    :pIsOnlineMeeting="appointment.isOnlineMeeting"
                    :pJoinLabel="t('join')"
                    :pIsActive="false"
                  />
                </div>
              </template>
              <NoAppointmentsPlaceholder
                v-else
                :message="t('noPast')"
              />
            </div>
          </PTabPane>
        </PTabs>
      </div>

      <div
        v-if="props.isCollaborator === false"
        class="
          padding-y--4
          padding-left--4
          flex
          flex--justify-content-flex-end
        "
      >
        <PButton
          pType="primary"
          pSize="small"
          @click="onTakeAppointment"
        >
          <PIcon
            pName="calendarEvent"
            pSize="16"
            class="margin-right--2"
          />
          {{ t('takeAppointment') }}
        </PButton>
      </div>
    </div>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PTabs,
  PTabPane,
  PAppointmentCard,
  PButton,
  PIcon,
  PLoader,
} from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import type { AppointmentResponse } from '@booking/types'
import type { PDrawerProps, PToolboxItemProps } from '@pulse/styleguide/types'
import type { BookingAppointmentsListDrawerProps } from './booking-appointments-list-drawer.types'
import NoAppointmentsPlaceholder from './components/no-appointments-placeholder.vue'
import { AppointmentTab } from '@booking/types'

const props = withDefaults(defineProps<BookingAppointmentsListDrawerProps>(), {
  isCollaborator: false,
  upcomingAppointments: () => [],
  pastAppointments: () => [],
  isLoadingUpcoming: false,
  isLoadingPast: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'take-appointment': []
  'open-booking-config': []
  'tab-changed': [tab: string]
}>()

const { isMobile } = useResponsive()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      title: 'Appointments',
      tabs: {
        upcoming: 'Upcoming',
        past: 'Past',
      },
      join: 'Join',
      takeAppointment: 'Book appointment',
      noUpcoming: 'No upcoming appointments',
      noPast: 'No past appointments',
      openBookingConfig: 'Configure booking',
      appointmentWith: 'Appointment with {name}',
    },
    'fr-FR': {
      title: 'Rendez-vous',
      tabs: {
        upcoming: 'A venir',
        past: 'Passés',
      },
      join: 'Rejoindre',
      takeAppointment: 'Prendre rendez-vous',
      noUpcoming: 'Aucun rendez-vous à venir',
      noPast: 'Aucun rendez-vous passé',
      openBookingConfig: 'Configurer les rendez-vous',
      appointmentWith: 'RDV avec {name}',
    },
  },
})

const activeTab = ref(AppointmentTab.UPCOMING)

const isDrawerOpened = defineModel<boolean>({ default: false })

const showToolbox = computed(() => props.isCollaborator && isMobile.value === false)

const hasUpcomingAppointments = computed(() => props.upcomingAppointments.length > 0)
const hasPastAppointments = computed(() => props.pastAppointments.length > 0)

const toolboxParams = (): PDrawerProps['pHeaderToolbox'] => {
  const pElements: PToolboxItemProps[] = [
    {
      pValue: t('openBookingConfig'),
      pIconName: 'gear',
      pActionName: 'open-booking-config',
    },
  ]
  return { pElements }
}

function getAppointmentLabel(appointment: AppointmentResponse): string {
  return t('appointmentWith', { name: appointment.counterpartName })
}

function onJoinMeeting(appointment: AppointmentResponse) {
  if (appointment.joinWebUrl !== null) {
    window.open(appointment.joinWebUrl, '_blank')
  }
}

function onTakeAppointment() {
  emit('take-appointment')
}

function handleToolboxItemClick(actionName: string) {
  if (actionName === 'open-booking-config') {
    emit('open-booking-config')
  }
}

function closeDrawer() {
  isDrawerOpened.value = false
}

watch(activeTab, (newTab) => {
  emit('tab-changed', newTab)
})
</script>
