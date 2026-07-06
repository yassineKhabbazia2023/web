<template>
  <div
    class="
      commercial-proposal
      flex
      flex--direction-column
      margin-top--4
    "
  >
    <ConformitySectionSkeleton
      v-if="isLoading"
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
      :isCompleted="isCompleted"
      :isDownloading="isDownloading"
      :isSending="isSending"
      :hasSelectedFile="hasSelectedFile"
      @open="openCommercialProposalDocument"
      @send="sendCommercialProposalToCustomer"
      @files-selected="onFilesSelected"
      @file-deleted="onFileDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import { PAlert } from '@pulse/styleguide/components'
import { OnboardingStepStatus } from '../prospect-conformity.enums'
import ConformitySectionSkeleton from '../components/conformity-section-skeleton/conformity-section.skeleton.vue'
import { ConformitySkeletonVariant } from '../components/conformity-section-skeleton/conformity-section-skeleton.enums'
import CommercialProposalCustomer from './commercial-proposal-customer/commercial-proposal-customer.vue'
import CommercialProposalCollab from './commercial-proposal-collab/commercial-proposal-collab.vue'
import { useCommercialProposal } from './commercial-proposal.composable'
import type { CommercialProposalEmits, CommercialProposalProps } from './commercial-proposal.types'

const props = defineProps<CommercialProposalProps>()

const emit = defineEmits<CommercialProposalEmits>()

const { t } = useI18n()

const { isCollab, isCustomer } = storeToRefs(useUserStore())

const isCompleted = computed(() => props.status === OnboardingStepStatus.Completed)

// The skeleton only shows on first load, before the stepper status is known (it comes from
// the same fetch as isLoading), so it always reserves an in-progress shape: an information
// alert for the customer, an upload zone for the collaborator.
const skeletonVariant = computed(() =>
  isCustomer.value
    ? ConformitySkeletonVariant.InfoAlert
    : ConformitySkeletonVariant.DocumentUploadSend,
)

const {
  isDownloading,
  isSending,
  hasSelectedFile,
  openCommercialProposalDocument,
  onFilesSelected,
  onFileDeleted,
  sendCommercialProposalToCustomer,
} = useCommercialProposal(emit)
</script>
