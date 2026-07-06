<template>
  <div
    class="
      engagement-letter
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
      @sent="emit('sent')"
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
import EngagementLetterCustomer from './engagement-letter-customer/engagement-letter-customer.vue'
import EngagementLetterCollab from './engagement-letter-collab/engagement-letter-collab.vue'
import type { EngagementLetterEmits, EngagementLetterProps } from './engagement-letter.types'

const props = defineProps<EngagementLetterProps>()

const emit = defineEmits<EngagementLetterEmits>()

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
</script>
