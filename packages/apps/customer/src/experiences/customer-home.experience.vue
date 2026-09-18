<template>
  <div class="customer-home-experience">
    <MobileHomeLayout
      v-if="isMobile"
      :currentEntity
    >
      <template #header-actions>
        <BookingCustomerHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget />
      </template>
      <template #banner>
        <DematMailBanner v-if="isEntityView" />
      </template>
    </MobileHomeLayout>
    <HomeLayout
      v-else
      :currentEntity
      :favoriteEntities
      :userConfig
    >
      <template #header-actions>
        <BookingCustomerHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget />
      </template>
      <template #banner="{ bannerClass }">
        <DematMailBanner
          v-if="isEntityView"
          :class="bannerClass"
        />
      </template>
    </HomeLayout>

    <!-- Global demat mail collect dialog, opened from the banner above and the folder homepage -->
    <DematMailDialog v-if="isDematMailEligible" />

    <!-- Global Pennylane amendment dialog -->
    <GlobalPennylaneAmendmentDialog
      v-if="shouldShowPennylaneAmendmentDialog"
      v-model="showPennylaneAmendmentDialog"
      :access-details="pennylaneAccessDetails"
      :free-trial-info="pennylaneFreeTrialInfo"
      @accept-success="handleAcceptSuccess"
      @decline="onPennylaneAmendmentDecline"
    />

    <PennylaneAmendmentSuccessDialog
      v-model="showPennylaneAmendmentSuccessDialog"
      :free-trial-end-date="acceptedFreeTrialInfo?.freeTrialEndDate"
      :is-free-trial-expired="acceptedFreeTrialInfo?.isFreeTrialExpired"
    />

    <PennylaneAmendmentDeclineDialog
      v-model="showPennylaneAmendmentDeclineDialog"
      :free-trial-end-date="pennylaneFreeTrialInfo?.freeTrialEndDate"
    />

    <!-- Serenite offer dialog (electronic invoicing reform) -->
    <InvoicesSereniteDialog
      v-model="isInvoicesSereniteDialogVisible"
      @comply="onInvoicesSereniteComply"
      @close="onInvoicesSereniteDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { UserConfig } from '@pulse/shared/types'
import { useCurrentEntityRouting } from '@pulse/shared/composables'
import { DematMailBanner, DematMailDialog } from '@pulse/entities/demat-mail'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingCustomerHeaderWidget } from '@pulse/booking/widgets'
import { useUserStore, useCurrentEntityStore, useDematMailStore } from '@pulse/common/stores'
import { useBookingCustomerStore } from '@pulse/booking/stores'
import { useResponsive } from '@pulse/styleguide'
import { useCustomerQueryParams } from '@customer/composables/use-customer-query-params.composable'
import { usePennylaneAmendment, useInvoicesSerenite } from '@pulse/widgets/composables'
import GlobalPennylaneAmendmentDialog from '@customer/components/global-pennylane-amendment-dialog.vue'
import { PennylaneAmendmentSuccessDialog, PennylaneAmendmentDeclineDialog } from '@pulse/widgets/pennylane-dialogs'
import { InvoicesSereniteDialog } from '@pulse/widgets/invoices-serenite-dialog'

const MobileHomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.MobileHomeLayout),
)
const HomeLayout = defineAsyncComponent(() =>
  import('@pulse/shared/layouts').then(m => m.HomeLayout),
)

const currentEntityStore = useCurrentEntityStore()
const userStore = useUserStore()
const bookingStore = useBookingCustomerStore()

const { isMobile } = useResponsive()
const { isEntityView } = useCurrentEntityRouting()

const shouldShowBooking = computed(() => bookingStore.getIsBookingEnabled() === true)

const { favoriteEntities } = storeToRefs(userStore)
const isSingleEntity = computed(() => userStore.hasSingleEntity)
const currentEntity = computed(() => currentEntityStore.currentEntity)

const userConfig = computed((): UserConfig => ({
  isCollab: false,
  isCustomer: true,
  isSingleEntity: isSingleEntity.value ?? false,
}))

// Setup query params watchers (automatic via reactive watchers)
useCustomerQueryParams()

// Demat mail collect: the eligibility is account-level, it is reloaded on every folder switch.
// The current entity is also set outside entity views (restored from the local storage on the
// wallet), where the solicitation is never shown: only an entity actually viewed is loaded.
const dematMailStore = useDematMailStore()
const { isEligible: isDematMailEligible } = storeToRefs(dematMailStore)
const dematMailEntityId = computed(() => (isEntityView.value ? currentEntityStore.currentEntityId : undefined))

watch(dematMailEntityId, (entityId) => {
  if (entityId !== undefined) {
    dematMailStore.load(entityId)
  }
}, { immediate: true })

// Pennylane amendment
const {
  showPennylaneAmendmentDialog,
  showPennylaneAmendmentSuccessDialog,
  showPennylaneAmendmentDeclineDialog,
  pennylaneAccessDetails,
  pennylaneFreeTrialInfo,
  acceptedFreeTrialInfo,
  shouldShowPennylaneAmendmentDialog,
  checkPennylaneAccess,
  captureAcceptedFreeTrialInfo,
  onPennylaneAmendmentAcceptSuccess,
  onPennylaneAmendmentDecline,
} = usePennylaneAmendment()

// Serenite offer dialog
const {
  isDialogVisible: isInvoicesSereniteDialogVisible,
  checkEligibility: checkInvoicesSereniteEligibility,
  onComply: onInvoicesSereniteComply,
  onDialogClose: onInvoicesSereniteDialogClose,
} = useInvoicesSerenite()

function handleAcceptSuccess() {
  captureAcceptedFreeTrialInfo()
  onPennylaneAmendmentAcceptSuccess()
}

onMounted(async () => {
  await checkPennylaneAccess()
  if (shouldShowPennylaneAmendmentDialog.value) {
    showPennylaneAmendmentDialog.value = true
  }

  // the Serenite dialog must not compete with the Pennylane amendment flow
  if (shouldShowPennylaneAmendmentDialog.value === false) {
    await checkInvoicesSereniteEligibility()
  }
})
</script>
