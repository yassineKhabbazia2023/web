<template>
  <PTable
    tableLayout="fixed"
    :pData="pendingOperations"
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
                getFullNameWithUppercaseLastName(scope.row.firstName, scope.row.lastName)
              "
              :pContent="scope.row.email"
              :pDisabled="false"
              :pSelected="false"
              :pAvatarRole="AvatarRoles.COLLAB"
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
          <PTooltip :pContent="t('refuseAccess')" :pHideAfter="0">
            <PButton
              v-if="scope.row.status !== OperationStatus.APPROVED"
              pType="danger"
              pSize="small"
              class="margin-right--2"
              pPlain
              data-testid="reject-access-button"
              @click="$emit('reject-operation', scope.row)"
            >
              <PIcon pName="x" />
            </PButton>
          </PTooltip>
          <PTooltip
            :pContent="t('validateAccess')"
            :disabled="scope.row.status === OperationStatus.APPROVED"
            :pHideAfter="0"
          >
            <PButton
              pType="tertiary"
              pSize="small"
              :pDisabled="scope.row.status === OperationStatus.APPROVED"
              pPlain
              data-testid="approve-access-button"
              @click="$emit('approve-operation', scope.row)"
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
import { type DefineDateTimeFormat, useI18n } from 'vue-i18n'
import {
  PTable,
  PIcon,
  PButton,
  PTooltip,
  PDoubleText,
  PTableColumn,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getFullNameWithUppercaseLastName } from '@entities/utils'
import type { Operation } from '@entities/types'
import { OperationStatus } from '@entities/enums'
import { getInitials } from '@entities/helpers'
import { PendingOperationTableProps } from './PendingOperationsTable.types'

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

defineProps<PendingOperationTableProps>()
defineEmits<{
  'reject-operation': [Operation]
  'approve-operation': [Operation]
}>()
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
