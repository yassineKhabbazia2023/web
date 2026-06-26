<template>
  <template v-if="isCompleted">
    <p
      class="
        font-size--14
        margin--0
        margin-bottom--6
      "
    >
      {{ t(`${I18N_KEY}.customerDocumentSubtitle`) }}
    </p>
    <EngagementLetterBanner @open="openEngagementLetterDocument" />
    <PButton
      pType="primary"
      :pLoading="isDownloading"
      class="margin-top--4"
      @click="openEngagementLetterDocument"
    >
      {{ t(`${I18N_KEY}.consult`) }}
    </PButton>
  </template>
  <PAlert
    v-else
    pType="information"
  >
    <i18n-t :keypath="`${I18N_KEY}.customerPendingAlert`">
      <template #creationStatus>
        <strong>{{ t(`${I18N_KEY}.customerPendingAlertBold`) }}</strong>
      </template>
    </i18n-t>
  </PAlert>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert, PButton } from '@pulse/styleguide/components'
import EngagementLetterBanner from '../engagement-letter-banner/engagement-letter-banner.vue'
import { useEngagementLetter } from '../engagement-letter.composable'
import type { EngagementLetterCustomerProps } from './engagement-letter-customer.types'

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'

const { t } = useI18n()

defineProps<EngagementLetterCustomerProps>()

const { isDownloading, openEngagementLetterDocument } = useEngagementLetter()
</script>
