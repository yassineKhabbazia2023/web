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
      :pMinWidth="240"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center">
          <div class="margin-right--2">
            <PAvatar :pRole="AvatarRoles.COLLAB" pType="small">
              {{ getInitials(scope.row.firstName, scope.row.lastName) }}
            </PAvatar>
          </div>
          <div class="pending-operations-table__user">
            <div>
              {{ getFullNameWithUppercaseLastName(scope.row.firstName, scope.row.lastName) }}
            </div>
            <div
              class="
                pending-operations-table__user-contact
                font-small
                text-color--gray-500
              "
            >
              <span class="pending-operations-table__user-email">{{ scope.row.email }}</span>
              <span
                v-if="isNotNullNorEmpty(scope.row.mobilePhone?.trim())"
                data-testid="user-mobile-phone"
              >
                | {{ formatPhoneNumber(scope.row.mobilePhone) }}
              </span>
              <span
                v-else
                data-testid="user-missing-phone"
              >
                | <span class="text-color--red-800">{{ t('missingNumber') }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn :pLabel="t('role')" :pMinWidth="110">
      <template #default="scope">
        <PTag
          v-if="scope.row.isSignatory === true"
          pColor="blue"
          :pContent="t('signatory')"
          data-testid="user-signatory-tag"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      pProp="creationDate"
      :pLabel="t('requestDate')"
      :pMinWidth="150"
      pSortable
    >
      <template #default="scope">
        <p>{{ d(scope.row.creationDate) }}</p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('actions')"
      :pMinWidth="90"
      pAlign="right"
    >
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
  PTag,
  PButton,
  PTooltip,
  PAvatar,
  PTableColumn,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { formatPhoneNumber } from '@pulse/toolbox/utils/string'
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
  messages: {
    'en-US': {
      user: 'User',
      role: 'Role',
      signatory: 'Signatory',
      missingNumber: 'Missing phone number',
      actions: 'Actions',
      requestDate: 'Request date',
      refuseAccess: 'Refuse access',
      validateAccess: 'Validate access',
      validateUserAccess: 'Validate user access',
      accessDeniedForUser: 'Access has been refused for the user',
      accessGrantedForUser: 'Access has been validated for the user',
      technicalError: 'The operation failed due to a technical error. Please try again later.',
      accessNote: 'These users are awaiting validation of access to the entity.Validate access?',
    },
    'fr-FR': {
      user: 'Utilisateur',
      role: 'Rôle',
      signatory: 'Signataire',
      missingNumber: 'Numéro de téléphone manquant',
      actions: 'Actions',
      requestDate: 'Date de la demande',
      refuseAccess: 'Refuser l\'accès',
      validateAccess: 'Valider l\'accès',
      validateUserAccess: 'Valider l\'accès utilisateur',
      accessDeniedForUser: 'L\'accès a été refusé pour l\'utilisateur',
      accessGrantedForUser: 'L\'accès a été validé pour l\'utilisateur',
      technicalError: 'L\'opération a échoué suite à une erreur technique. Veuillez réessayer plus tard.',
      accessNote: 'Ces utilisateurs sont en attente de validation d\'accès à l\'entité. Valider l\'accès ?',
    },
  },
})

defineProps<PendingOperationTableProps>()
defineEmits<{
  'reject-operation': [Operation]
  'approve-operation': [Operation]
}>()
</script>

<style lang="scss" scoped>
.pending-operations-table {
  // Cells default to no-wrap; let the whole user block wrap instead so the
  // name, email and phone always stay fully visible.
  &__user {
    white-space: normal;
  }

  // When narrow, the phone / "missing number" moves to the next line as a
  // whole; the email itself only breaks as a last resort.
  &__user-contact {
    display: flex;
    flex-wrap: wrap;
    column-gap: 4px;
  }

  &__user-email {
    overflow-wrap: anywhere;
  }
}
</style>

