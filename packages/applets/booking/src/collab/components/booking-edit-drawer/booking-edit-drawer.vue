<template>
  <PDrawer
    v-model="isBookingEditDrawerOpened"
    class="booking-edit-drawer"
    data-testid="booking-edit-drawer"
    :pTitle="t('drawerTitle')"
    pSize="33%"
    destroyOnClose
    :beforeClose="handleBeforeClose"
    @close-drawer-button="handleBeforeClose"
  >
    <div
      v-if="isLoading"
      class="
        flex
        flex--align-items-center
        flex--justify-content-center
        height--100
      "
    >
      <PLoader pSize="28" />
    </div>

    <template v-else-if="configurationDetails !== null">
      <PTabs v-model="activeTab">
        <PTabPane
          :pLabel="t('tabs.general')"
          :pName="BookingEditDrawerTab.GENERAL"
        >
          <div class="padding--4">
            <BookingAppointmentConfiguration
              v-model="appointmentDetails"
            />
          </div>
        </PTabPane>
        <PTabPane
          :pLabel="t('tabs.days')"
          :pName="BookingEditDrawerTab.DAYS"
        >
          <div class="padding--4">
            <BookingTimeSlotsConfiguration
              v-model="timeSlotsConfiguration"
            />
          </div>
        </PTabPane>
        <PTabPane
          :pLabel="t('tabs.emailSignature')"
          :pName="BookingEditDrawerTab.EMAIL_SIGNATURE"
        >
          <div class="padding--4">
            <BookingShareLink :bookingUrl="bookingUrl" />
          </div>
        </PTabPane>
      </PTabs>
    </template>

    <template #footer>
      <div
        v-if="activeTab === BookingEditDrawerTab.EMAIL_SIGNATURE"
        class="flex flex--justify-content-flex-end width--100"
      >
        <PButton
          pType="primary"
          @click="handleBeforeClose"
        >
          {{ t('buttons.close') }}
        </PButton>
      </div>
      <div
        v-else
        class="flex flex--justify-content-flex-end width--100"
      >
        <PButton
          pType="primary"
          :pLoading="isSaving"
          @click="handleSave"
        >
          {{ t('buttons.save') }}
        </PButton>
      </div>
    </template>
  </PDrawer>

  <!-- Confirmation modal -->
  <BookingEditConfirmationModal
    v-model="isConfirmationModalOpen"
    :isLoading="isSaving"
    @cancel="handleDiscardChanges"
    @confirm="confirmSave"
  />

  <!-- Hidden teleport target to absorb Teleports from child components -->
  <Teleport to="body">
    <div
      id="booking-drawer__footer"
      class="display--none position--absolute visibility--hidden"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PDrawer, PTabs, PTabPane, PLoader, PButton } from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import BookingAppointmentConfiguration from '../booking-appointment-configuration/booking-appointment-configuration.vue'
import BookingTimeSlotsConfiguration from '../booking-time-slots-configuration/booking-time-slots-configuration.vue'
import BookingShareLink from '../booking-confirmation/booking-share-link.vue'
import BookingEditConfirmationModal from './booking-edit-confirmation-modal.vue'
import { useBookingEditDrawer } from './booking-edit-drawer.composable'
import { BookingEditDrawerTab } from './booking-edit-drawer.enums'
import { useBookingUrl } from '@booking/composables/use-booking-url.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      drawerTitle: 'Booking slots',
      tabs: {
        general: 'General',
        days: 'Days',
        emailSignature: 'Email signature',
      },
      buttons: {
        save: 'Save',
        close: 'Close',
      },
      notifications: {
        success: 'Your booking slots have been successfully updated.',
        error: 'An error occurred while updating your booking slots. Please try again later.',
      },
    },
    'fr-FR': {
      drawerTitle: 'Créneaux de réservation',
      tabs: {
        general: 'Général',
        days: 'Jours',
        emailSignature: 'Signature de mail',
      },
      buttons: {
        save: 'Enregistrer',
        close: 'Fermer',
      },
      notifications: {
        success: 'Votre plage de rendez-vous a bien été modifiée.',
        error: 'Une erreur est survenue lors de la modification de vos créneaux de rendez-vous. Veuillez recommencer ultérieurement.',
      },
    },
  },
})

const {
  isBookingEditDrawerOpened,
  activeTab,
  isLoading,
  isSaving,
  isConfirmationModalOpen,
  configurationDetails,
  appointmentDetails,
  timeSlotsConfiguration,
  handleBeforeClose,
  handleDiscardChanges,
  handleSave,
  confirmSave,
} = useBookingEditDrawer({
  onSuccess: () => displayNotification('success', t('notifications.success')),
  onError: () => displayNotification('error', t('notifications.error')),
})

const { bookingUrl } = useBookingUrl()
</script>
