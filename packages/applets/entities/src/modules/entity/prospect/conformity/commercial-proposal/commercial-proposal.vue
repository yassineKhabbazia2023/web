<template>
  <div
    class="
      commercial-proposal
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
      v-else-if="isLoading"
      :variant="skeletonVariant"
    />
    <PAlert
      v-else-if="status === undefined"
      pType="danger"
      :pClosable="false"
    >
      {{ t('entities.prospect.conformity.loadError') }}
    </PAlert>
    <CommercialProposalCustomer
      v-else-if="isCustomer"
      :isCompleted="isCompleted"
      :isDownloading="isDownloading"
      @open="openCommercialProposalDocument"
    />
    <CommercialProposalCollab
      v-else-if="isCollab"
      v-model="selectedCommercialProposalFile"
      :isCompleted="isCompleted"
      :isDownloading="isDownloading"
      :isSending="isSending"
      @open="openCommercialProposalDocument"
      @send="sendCommercialProposalToCustomer"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import { PAlert, PLoader } from '@pulse/styleguide/components'
import { OnboardingStepStatus } from '../prospect-conformity.enums'
import ConformitySectionSkeleton from '../components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '../components/conformity-section-skeleton/conformity-section-skeleton.enums'
import CommercialProposalCustomer from './commercial-proposal-customer/commercial-proposal-customer.vue'
import CommercialProposalCollab from './commercial-proposal-collab/commercial-proposal-collab.vue'
import { useCommercialProposal } from './commercial-proposal.composable'
import type { CommercialProposalEmits } from './commercial-proposal.types'

const emit = defineEmits<CommercialProposalEmits>()

const { t } = useI18n()

const { isCollab, isCustomer } = storeToRefs(useUserStore())

const {
  status,
  isLoading,
  isRefreshingStatus,
  isDownloading,
  isSending,
  selectedCommercialProposalFile,
  openCommercialProposalDocument,
  sendCommercialProposalToCustomer,
} = useCommercialProposal(emit)

const isCompleted = computed(() => status.value === OnboardingStepStatus.Completed)

// The skeleton only shows on first load, before this step's status is known, so it always
// reserves an in-progress shape: an information alert for the customer, an upload zone for the collaborator.
const skeletonVariant = computed(() =>
  isCustomer.value
    ? ConformitySkeletonVariant.InfoAlert
    : ConformitySkeletonVariant.DocumentUploadSend,
)
</script>
