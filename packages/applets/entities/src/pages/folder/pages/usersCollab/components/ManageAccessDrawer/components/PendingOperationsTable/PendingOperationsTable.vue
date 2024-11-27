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
    <span data-testid="access-table-note">
      {{ t('accessNote') }}
    </span>
  </div>
  <PTable
    tableLayout="fixed"
    :pData="availableOperations"
    showOverflowTooltip
    pStripe
  >
    <PTableColumn
      pProp="email"
      :pLabel="t('user')"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center">
          <div class="margin-right--2">
            <PDoubleText
              pType="primary"
              :pTitle="
                getFullName(scope.row.firstName, scope.row.lastName, true)
              "
              :pContent="scope.row.email"
              :pDisabled="false"
              :pSelected="false"
              :pProfile="getInitials(scope.row.firstName, scope.row.lastName)"
            />
          </div>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      pProp="creationDate"
      :pLabel="t('requestDate')"
      pSortable
    >
      <template #default="scope">
        <p>{{ d(scope.row.creationDate) }}</p>
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('actions')" pAlign="right">
      <template #default="scope">
        <div class="flex flex--align-items-center">
          <PTooltip :pContent="t('refuseAccess')">
            <PButton
              v-if="scope.row.status !== OperationStatus.APPROVED"
              pType="primary"
              pSize="small"
              class="margin-right--2"
              pPlain
              data-testid="reject-access-button"
              @click="handleRejectOperation(scope.row)"
            >
              <PIcon pName="x" />
            </PButton>
          </PTooltip>
          <PTooltip
            :pContent="t('validateAccess')"
            :disabled="scope.row.status === OperationStatus.APPROVED"
          >
            <PButton
              pType="primary"
              pSize="small"
              :pDisabled="scope.row.status === OperationStatus.APPROVED"
              pPlain
              data-testid="approve-access-button"
              @click="handleApproveOperation(scope.row)"
            >
              <PIcon pName="check" />
            </PButton>
          </PTooltip>
        </div>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type DefineDateTimeFormat, useI18n } from 'vue-i18n'
import {
  PTable,
  PIcon,
  PButton,
  PTooltip,
  PDoubleText,
  PTableColumn,
} from '@pulse/styleguide/components'
import { amplitudeService } from '@pulse/common'
import { displayNotification, getFullName } from '@entities/common/utils'
import type { Operation } from '@entities/common/types/OperationTypes'
import { OperationStatus } from '@entities/common/types/OperationTypes'
import { getInitials } from '@entities/helper'
import { useOperation } from '@entities/pages/folder/pages/usersCollab/composables/useOperation'
import ConfirmActionModal from './components/ConfirmActionModal'
import { patchOperationStatus } from '@entities/services/contact'
import { AmplitudeOperationStatus } from './PendingOperationsTableTypes'

const datetimeFormats = {
  'en-US': {
    month: {
      month: 'long',
    },
  },
  'fr-FR': {
    month: {
      month: 'long',
    },
  },
} as Record<string, DefineDateTimeFormat>

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const emit = defineEmits<{
  'update-operation-table': []
}>()

const { availableOperations } = useOperation()
const selectedOperation = ref<Operation>()

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
  amplitudeService.track('Registry Validation Started', {
    registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
  })
}
const handleApproveOperation = (operation: Operation) => {
  selectOperation(operation)
  approveOperation()
  openConfirmationModal()
  amplitudeService.track('Registry Validation Started', {
    registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED,
  })
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
    const amplitudeEventPropsForReject = {
      registry_validation_reason: reasonForRefusal,
      registry_validation_start_result: AmplitudeOperationStatus.REJECTED,
    }
    amplitudeService.track(
      'Registry Validation Completed',
      isOperationPendingRefusal.value
        ? amplitudeEventPropsForReject
        : { registry_validation_start_result: AmplitudeOperationStatus.ACCEPTED },
    )
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

defineExpose({
  isConfirmationModalVisible,
  isOperationPendingRefusal,
  selectedOperation,
  handleRejectOperation,
  handleApproveOperation,
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
