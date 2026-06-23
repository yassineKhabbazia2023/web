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
    <CommercialProposalBanner @open="emit('open')" />
    <PButton
      pType="primary"
      :pLoading="isDownloading"
      class="margin-top--4"
      @click="emit('open')"
    >
      {{ t(`${I18N_KEY}.consult`) }}
    </PButton>
  </template>
  <PAlert
    v-else
    pType="information"
    class="margin-top--3"
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
import CommercialProposalBanner from '../commercial-proposal-banner/commercial-proposal-banner.vue'
import type { CommercialProposalCustomerEmits, CommercialProposalCustomerProps } from './commercial-proposal-customer.types'

const I18N_KEY = 'entities.prospect.conformity.proposal'

const { t } = useI18n()

defineProps<CommercialProposalCustomerProps>()

const emit = defineEmits<CommercialProposalCustomerEmits>()
</script>
