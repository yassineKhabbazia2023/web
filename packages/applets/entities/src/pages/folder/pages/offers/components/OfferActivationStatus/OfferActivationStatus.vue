<template>
  <PTag
    :pColor="formattedStatus.color"
    pEffect="light"
    :pIconLeftName="formattedStatus.iconName"
    :pContent="formattedStatus.text"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTag } from '@pulse/styleguide/components'
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
    return { text: t('validated'), color: 'success', iconName: 'checkCircle' }
  case OfferActivationStatus.REJECTED:
    return { text: t('rejected'), color: 'danger', iconName: 'xCircle' }
  case OfferActivationStatus.PENDING_MIGRATION:
    return pendingMigrationStatus.value
  default:
    return { text: t('pending'), color: 'warning', iconName: 'infoCircle' }
  }
})

const pendingMigrationStatus = computed((): ActivationStatus => {
  const textKey = props.currentUser.isCollab ? 'pendingMigrationCollab' : 'pendingMigrationClient'

  return {
    text: t(textKey),
    color: 'warning',
    iconName: 'infoCircle',
  }
})
</script>

<i18n lang="yaml">
en-US:
  validated: 'Validated'
  rejected: 'Rejected'
  pending: 'Pending'
  pendingMigrationClient: 'In the process of activation'
  pendingMigrationCollab: 'In the process of validation'

fr-FR:
  validated: 'Validée'
  rejected: 'Rejetée'
  pending: 'En attente'
  pendingMigrationClient: 'En cours d’activation'
  pendingMigrationCollab: 'En cours de validation'
</i18n>
