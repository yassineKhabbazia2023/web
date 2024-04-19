<template>
  <PTag
    :pColor="formattedStatus.color"
    pEffect="light"
    :pIconLeft="formattedStatus.icon"
    :pContent="formattedStatus.text"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTag } from '@kpmg/styleguide'
import type {
  OfferActivationStatusProps,
  ActivationStatus,
} from './OfferActivationStatusTypes'
import { OfferActivationStatus } from './OfferActivationStatusTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<OfferActivationStatusProps>()

const formattedStatus = computed((): ActivationStatus => {
  switch (props.status) {
    case OfferActivationStatus.VALIDATED:
      return { text: t('validated'), color: 'success', icon: 'PICheckCircle' }
    case OfferActivationStatus.REJECTED:
      return { text: t('rejected'), color: 'danger', icon: 'PIXCircle' }
    default:
      return { text: t('pending'), color: 'warning', icon: 'PIInfoCircle' }
  }
})
</script>

<i18n lang="yaml">
en-US:
  validated: 'Validated'
  rejected: 'Rejected'
  pending: 'Pending'
fr-FR:
  validated: 'Validée'
  rejected: 'Rejetée'
  pending: 'En attente'
</i18n>
