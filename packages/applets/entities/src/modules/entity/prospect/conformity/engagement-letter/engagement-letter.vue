<template>
  <div
    class="
      engagement-letter
      flex
      flex--direction-column
      margin-top--4
    "
  >
    <div
      v-if="isRefreshingStatus"
      class="
        flex
        flex--justify-content-center
        padding-y--6
      "
    >
      <PLoader
        pType="primary"
        pSize="48"
      />
    </div>
    <ConformitySectionSkeleton
      v-else-if="isLoadingStatus"
      :variant="skeletonVariant"
    />
    <PAlert
      v-else-if="status === undefined"
      class="margin-top--4"
      pType="danger"
      :pClosable="false"
    >
      {{ t('entities.prospect.conformity.engagementLetter.loadError') }}
    </PAlert>

    <EngagementLetterCustomer
      v-else-if="isCustomer"
      :isCompleted="isCompleted"
    />

    <EngagementLetterCollab
      v-else-if="isCollab"
      :isCompleted="isCompleted"
      @sent="onSent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import { PAlert, PLoader } from '@pulse/styleguide/components'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'
import { useOnboardingStepStatus } from '../onboarding-step-status.composable'
import ConformitySectionSkeleton from '../components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '../components/conformity-section-skeleton/conformity-section-skeleton.enums'
import EngagementLetterCustomer from './engagement-letter-customer/engagement-letter-customer.vue'
import EngagementLetterCollab from './engagement-letter-collab/engagement-letter-collab.vue'
import type { EngagementLetterEmits } from './engagement-letter.types'

const emit = defineEmits<EngagementLetterEmits>()

const { t } = useI18n()

const { isCollab, isCustomer } = storeToRefs(useUserStore())

const {
  status,
  isLoadingStatus,
  isRefreshingStatus,
  reloadStatus,
} = useOnboardingStepStatus(OnboardingStep.EngagementLetter)

const isCompleted = computed(() => status.value === OnboardingStepStatus.Completed)

// Refresh this section's own status, then let the parent refresh the stepper.
const onSent = async (): Promise<void> => {
  await reloadStatus()
  emit('sent')
}

// The skeleton only shows on first load, before this step's status is known, so it always
// reserves an in-progress shape: an information alert for the customer, an upload zone for the collaborator.
const skeletonVariant = computed(() =>
  isCustomer.value
    ? ConformitySkeletonVariant.InfoAlert
    : ConformitySkeletonVariant.DocumentUploadSend,
)
</script>
