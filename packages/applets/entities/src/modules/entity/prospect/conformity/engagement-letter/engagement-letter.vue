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
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        margin-top--4
      "
    >
      <PLoader pType="primary" pSize="48" />
    </div>
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
import { PAlert, PLoader } from '@pulse/styleguide/components'
import { OnboardingStepStatus } from '../prospect-conformity.enums'
import EngagementLetterCustomer from './engagement-letter-customer/engagement-letter-customer.vue'
import EngagementLetterCollab from './engagement-letter-collab/engagement-letter-collab.vue'
import type { EngagementLetterEmits, EngagementLetterProps } from './engagement-letter.types'

const props = defineProps<EngagementLetterProps>()

const emit = defineEmits<EngagementLetterEmits>()

const { t } = useI18n()

const { isCollab, isCustomer } = storeToRefs(useUserStore())

const isCompleted = computed(() => props.status === OnboardingStepStatus.Completed)
</script>
