<template>
  <PTag
    :pColor="formattedStatus.color"
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
import { OfferActivationStatus } from '../../enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      activated: 'Activated',
      rejected: 'Rejected',
      pending: 'In the process of activation',
      pendingMigrationCollab: 'In the process of validation',
      failedMigration: 'Failed migration',
    },
    'fr-FR': {
      activated: 'Activée',
      rejected: 'Rejetée',
      pending: 'En cours d\'activation',
      pendingMigrationCollab: 'En cours de validation',
      failedMigration: 'Migration échouée',
    },
  },
})

const props = defineProps<OfferActivationStatusProps>()

const formattedStatus = computed((): ActivationStatus => {
  switch (props.status) {
    case OfferActivationStatus.VALIDATED:
      return { text: t('activated'), color: 'success', iconName: 'checkCircle' }
    case OfferActivationStatus.REJECTED:
      return { text: t('rejected'), color: 'danger', iconName: 'xCircle' }
    case OfferActivationStatus.PENDING_MIGRATION:
      return pendingMigrationStatus.value
    case OfferActivationStatus.FAILED_MIGRATION:
      return { text: t('failedMigration'), color: 'danger', iconName: 'exclamationTriangle' }
    default:
      return { text: t('pending'), color: 'warning', iconName: 'infoCircle' }
  }
})

const pendingMigrationStatus = computed((): ActivationStatus => {
  const textKey = props.currentUser.isCollab ? 'pendingMigrationCollab' : 'pending'

  return {
    text: t(textKey),
    color: 'warning',
    iconName: 'infoCircle',
  }
})
</script>

