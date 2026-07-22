<template>
  <div class="customer-home-experience">
    <MobileHomeLayout
      v-if="shouldShowMobileLayout === true"
      :currentEntity
    >
      <template #header-actions>
        <BookingCustomerHeaderWidget v-if="shouldShowBooking === true" />
        <FeedCenterHeaderWidget />
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
    </HomeLayout>

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
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { UserConfig } from '@pulse/shared/types'
import { FeedCenterHeaderWidget } from '@pulse/feed-center/widgets/feed-center-header'
import { BookingCustomerHeaderWidget } from '@pulse/booking/widgets'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { useBookingCustomerStore } from '@pulse/booking/stores'
import { useResponsive } from '@pulse/styleguide'
import { useCustomerQueryParams } from '@customer/composables/use-customer-query-params.composable'
import { usePennylaneAmendment } from '@pulse/widgets/composables'
import GlobalPennylaneAmendmentDialog from '@customer/components/global-pennylane-amendment-dialog.vue'
import { PennylaneAmendmentSuccessDialog, PennylaneAmendmentDeclineDialog } from '@pulse/widgets/pennylane-dialogs'

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

const shouldShowMobileLayout = computed(() =>
  FeatureFlagManager.isResponsiveActivated() && isMobile.value === true,
)
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

function handleAcceptSuccess() {
  captureAcceptedFreeTrialInfo()
  onPennylaneAmendmentAcceptSuccess()
}

onMounted(async () => {
  await checkPennylaneAccess()
  if (shouldShowPennylaneAmendmentDialog.value) {
    showPennylaneAmendmentDialog.value = true
  }
})
</script>
