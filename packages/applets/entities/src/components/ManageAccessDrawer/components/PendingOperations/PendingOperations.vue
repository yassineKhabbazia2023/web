<template>
  <ConfirmActionModal
    v-if="isConfirmationModalVisible && selectedOperation"
    v-model="isConfirmationModalVisible"
    :selectedOperation="selectedOperation"
    :isOperationPendingRefusal="isOperationPendingRefusal"
    @confirm-action="handleConfirmAction"
  />
  <div class="margin-bottom--4">
    <p class="font-large margin-bottom--2">
      {{ t('validateUserAccess') }}
    </p>
    <p data-testid="access-table-note">
      {{ t('accessNote') }}
    </p>
    <PFormSearch
      v-if="isGlobalMode === true"
      :pSearch="searchTerm"
      :pSearchInvalidMessage="t('invalidSearch')"
      :pPlaceholder="t('searchPlaceholder')"
      pSize="small"
      class="margin-top--2 max-width-300"
      @update:p-search="onUpdateSearchTerm"
    />
  </div>

  <div
    v-if="showNoDemand === true"
    class="
        width--100
        height--100
        flex
        flex--direction-column
        flex--justify-content-center
        flex--align-items-center
        flex-gap--4
        text-color--base-blue-pulse
      "
  >
    <PIcon
      pName="slashCircle"
      pSize="32"
    />
    <div
      data-test-id="no-demand-for-search-term"
      class="font-semibold"
    >
      {{ t('no-demand-for-search-term', { searchTerm: props.searchTerm }) }}
    </div>
  </div>

  <template v-if="showNoDemand === false">
    <PAccordion
      v-for="(accountOperations, index) in accountOperationsList"
      :key="index"
      :pIsOpen="openedAccountNumbers.includes(accountOperations.accountNumber)"
      class="margin-bottom--4 width--100"
      pHeaderCssClass="bg--neutral-gray-50 margin-bottom--1"
      :pHasHeader="isGlobalMode"
      @open="addIfNotExists(openedAccountNumbers, accountOperations.accountNumber)"
      @close="removeIfExists(openedAccountNumbers, accountOperations.accountNumber)"
    >
      <template
        v-if="isGlobalMode"
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
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addIfNotExists, removeIfExists } from '@pulse/toolbox/utils/array'
import { PAccordion, PFormSearch, PIcon } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { displayNotification } from '@pulse/styleguide'
import type { Operation } from '@entities/types/OperationTypes'
import { OperationStatus } from '@entities/enums'
import ConfirmActionModal from './components/ConfirmActionModal'
import PendingOperationsTable from './components/PendingOperationsTable'
import AccountHeader from './components/AccountHeader'
import { patchOperationStatus } from '@entities/services/contact'
import { PendingOperationProps } from './PendingOperations.types'
import {
  getTrackStartedApprovalEventProperty,
  getTrackStartedRejectionEventProperty,
  getTrackCompletedApprovalEventProperty,
  getTrackCompletedRejectionEventProperty,
} from './PendingOperations.utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<PendingOperationProps>(), {
  isGlobalMode: false,
})

const openedAccountNumbers = ref<string[]>([])

const emit = defineEmits<{
  'update-operation-table': []
  'update:search-term': [string]
}>()

const selectedOperation = ref<Operation>()

const showNoDemand = computed(() => props.searchTerm !== '' && props.accountOperationsList.length === 0)

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
  const eventProperty = getTrackStartedRejectionEventProperty(props.trackingLocalisation)
  AmplitudeService.track('Registry Validation Started', eventProperty)
}

const handleApproveOperation = (operation: Operation) => {
  selectOperation(operation)
  approveOperation()
  openConfirmationModal()
  const eventProperty = getTrackStartedApprovalEventProperty(props.trackingLocalisation)
  AmplitudeService.track('Registry Validation Started', eventProperty)
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
    const eventProperty = isOperationPendingRefusal.value
      ? getTrackCompletedRejectionEventProperty(props.trackingLocalisation, reasonForRefusal)
      : getTrackCompletedApprovalEventProperty(props.trackingLocalisation)

    AmplitudeService.track('Registry Validation Completed', eventProperty)
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

function onUpdateSearchTerm(searchValue: string) {
  emit('update:search-term', searchValue)
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
  searchPlaceholder: 'Company name or folder ID'
  invalidSearch: 'Minimum three characters required'
  no-demand-for-search-term: 'No access management requests found for "{searchTerm}""'
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
  searchPlaceholder: 'Raison sociale ou code client'
  invalidSearch: 'Trois caractères minimum requis'
  no-demand-for-search-term: 'Aucune demande de gestion d’accès trouvée pour "{searchTerm}"'
</i18n>
