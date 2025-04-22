<template>
  <ConfirmActionModal
    v-if="isConfirmationModalVisible && selectedOperation"
    v-model="isConfirmationModalVisible"
    :selectedOperation="selectedOperation"
    :isOperationPendingRefusal="isOperationPendingRefusal"
    :legalName="legalName"
    @confirm-action="handleConfirmAction"
  />
  <div class="margin-bottom--4">
    <p class="font-large margin-bottom--2">
      {{ t('validateUserAccess') }}
    </p>
    <span data-testid="access-table-note">
      {{ t('accessNote') }}
    </span>
  </div>

  <PAccordion
    v-for="(accountOperations, index) in accountOperationsList"
    :key="index"
    :pIsOpen="openedAccountNumbers.includes(accountOperations.accountNumber)"
    class="margin-bottom--4"
    pHeaderCssClass="bg--persian-50 margin-bottom--1"
    :pHasHeader="showAccountName"
    @open="addIfNotExists(openedAccountNumbers, accountOperations.accountNumber)"
    @close="removeIfExists(openedAccountNumbers, accountOperations.accountNumber)"
  >
    <template
      v-if="showAccountName"
      #header
    >
      <AccountHeader
        :accountOperations="accountOperations"
        class="flex--grow-1"
      />
    </template>

    <PendingOperationsTable
      :pendingOperations="accountOperations.operations"
      @reject-operation="handleRejectOperation"
      @approve-operation="handleApproveOperation"
    />
  </PAccordion>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addIfNotExists, removeIfExists } from '@pulse/core/utils/array'
import { PAccordion } from '@pulse/styleguide/components'
import { amplitudeService } from '@pulse/common'
import { displayNotification } from '@entities/common/utils'
import type { Operation } from '@entities/common/types/OperationTypes'
import { OperationStatus } from '@entities/common/types/OperationTypes'
import ConfirmActionModal from './components/ConfirmActionModal'
import PendingOperationsTable from './components/PendingOperationsTable'
import AccountHeader from './components/AccountHeader'
import { patchOperationStatus } from '@entities/services/contact'
import { PendingOperationProps } from './PendingOperations.types'
import {
  getTrackStartedEventProperty,
  getTrackCompletedEventProperty,
  getLegalName,
} from './PendingOperations.utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PendingOperationProps>()

const openedAccountNumbers = ref<string[]>([])

const emit = defineEmits<{
  'update-operation-table': []
}>()

const selectedOperation = ref<Operation>()

const legalName = computed(() => getLegalName(selectedOperation.value, props.selectedEntityLegalName))

// #region handle actions
const isOperationPendingRefusal = ref(false)
const isConfirmationModalVisible = ref(false)
const selectOperation = (operation: Operation) => {
  selectedOperation.value = operation
}
const rejectOperation = () => {
  isOperationPendingRefusal.value = true
}
const approveOperation = () => {
  isOperationPendingRefusal.value = false
}
const openConfirmationModal = () => {
  isConfirmationModalVisible.value = true
}
const closeConfirmationModal = () => {
  isConfirmationModalVisible.value = false
}

const handleRejectOperation = (operation: Operation) => {
  selectOperation(operation)
  rejectOperation()
  openConfirmationModal()
  const eventProperty = getTrackStartedEventProperty(props.trackingLocalisation, true)
  amplitudeService.track('Registry Validation Started', eventProperty)
}
const handleApproveOperation = (operation: Operation) => {
  selectOperation(operation)
  approveOperation()
  openConfirmationModal()
  const eventProperty = getTrackStartedEventProperty(props.trackingLocalisation, false)
  amplitudeService.track('Registry Validation Started', eventProperty)
}
const executeOperation = async (reasonForRefusal?: string) => {
  if (selectedOperation.value) {
    // We update the status to execute the operation in the registry after 24 hours
    await patchOperationStatus(
      selectedOperation.value.operationId,
      isOperationPendingRefusal.value
        ? OperationStatus.REJECTED
        : OperationStatus.APPROVED,
    )

    // #region Amplitude implementation
    const eventProperty = getTrackCompletedEventProperty(
      props.trackingLocalisation,
      isOperationPendingRefusal.value,
      reasonForRefusal,
    )

    amplitudeService.track('Registry Validation Completed', eventProperty)
    // endregion

    displayNotification(
      'success',
      isOperationPendingRefusal.value
        ? t('accessDeniedForUser')
        : t('accessGrantedForUser'),
    )
  }
}
const handleConfirmAction = async (reasonForRefusal?: string) => {
  try {
    await executeOperation(reasonForRefusal)
    emit('update-operation-table')
  } catch {
    displayNotification('error', t('technicalError'))
  } finally {
    closeConfirmationModal()
  }
}
// #endregion

function resetOpenedAccordions() {
  const firstAccountNumber = props.accountOperationsList.at(0)?.accountNumber ?? undefined
  openedAccountNumbers.value = firstAccountNumber ? [firstAccountNumber] : []
}

onMounted(() => {
  resetOpenedAccordions()
})

defineExpose({
  isConfirmationModalVisible,
  isOperationPendingRefusal,
  selectedOperation,
  handleRejectOperation,
  handleApproveOperation,
  resetOpenedAccordions,
})
</script>

<i18n lang="yaml">
en-US:
  user: 'User'
  actions: 'Actions'
  requestDate: 'Request date'
  refuseAccess: 'Refuse access'
  validateAccess: 'Validate access'
  validateUserAccess: 'Validate user access'
  accessDeniedForUser: 'Access has been refused for the user'
  accessGrantedForUser: 'Access has been validated for the user'
  technicalError: 'The operation failed due to a technical error. Please try again later.'
  accessNote: 'These users are awaiting validation of access to the entity.Validate access?'
fr-FR:
  user: 'Utilisateur'
  actions: 'Actions'
  requestDate: 'Date de la demande'
  refuseAccess: "Refuser l'accès"
  validateAccess: "Valider l'accès"
  validateUserAccess: "Valider l'accès utilisateur"
  accessDeniedForUser: "L'accès a été refusé pour l'utilisateur"
  accessGrantedForUser: "L'accès a été validé pour l'utilisateur"
  technicalError: "L'opération a échoué suite à une erreur technique. Veuillez réessayer plus tard."
  accessNote: "Ces utilisateurs sont en attente de validation d'accès à l'entité. Valider l'accès ?"
</i18n>
