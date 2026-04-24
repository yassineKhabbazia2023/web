<template>
  <div>
    <PAlert
      class="margin-bottom--6"
      data-testid="permanent-delegations-info"
    >
      <span class="font-bold">{{ t('entities.permanentDelegations.infoBannerTitle') }}</span> {{ t('entities.permanentDelegations.infoBannerDescription') }}
    </PAlert>

    <div class="margin-bottom--6">
      <p class="font-semibold margin-bottom--2">
        {{ t('entities.permanentDelegations.listTitle') }}
      </p>
      <p>{{ t('entities.permanentDelegations.listDescription') }}</p>
    </div>

    <div
      v-if="isLoading"
      class="
        flex
        flex--align-items-center
        flex--justify-content-center
        padding-y--10
      "
    >
      <PLoader pSize="28" />
    </div>

    <PTable
      v-else
      class="width--100"
      :pData="permanentDelegations"
      pStripe
      data-testid="permanent-delegations-table"
    >
      <PTableColumn
        pSortable
        pMinWidth="150"
        :pLabel="t('entities.permanentDelegations.table.collaborator')"
      >
        <template #default="scope">
          <PDoubleText
            pType="primary"
            :pProfile="getInitials(scope.row.delegatee.firstName, scope.row.delegatee.lastName)"
            :pTitle="getFullNameWithUppercaseLastName(scope.row.delegatee.firstName, scope.row.delegatee.lastName)"
            :pAvatarRole="AvatarRoles.COLLAB"
          />
        </template>
      </PTableColumn>

      <PTableColumn
        pMinWidth="180"
        :pLabel="t('entities.permanentDelegations.table.email')"
      >
        <template #default="scope">
          {{ scope.row.delegatee.email }}
        </template>
      </PTableColumn>

      <PTableColumn
        pSortable
        pMinWidth="100"
        :pLabel="t('entities.permanentDelegations.table.startDate')"
      >
        <template #default="scope">
          {{ formatDateToLocale(scope.row.startDate) }}
        </template>
      </PTableColumn>

      <PTableColumn
        pMinWidth="70"
        :pLabel="t('entities.permanentDelegations.table.options')"
      >
        <template #default="scope">
          <PButton
            class="el-button--icon"
            data-testid="permanent-delegation-delete"
            @click="openConfirmationDialog(scope.row)"
          >
            <PIcon pName="trash" />
          </PButton>
        </template>
      </PTableColumn>
    </PTable>

    <DeleteDelegationModal
      v-if="delegationToDelete !== null"
      v-model="isConfirmationDialogVisible"
      :title="confirmationTitle"
      :content="t('entities.permanentDelegations.confirmation.content')"
      :question="t('entities.permanentDelegations.confirmation.question')"
      :confirmButtonLabel="t('entities.permanentDelegations.confirmation.confirm')"
      :cancelButtonLabel="t('entities.permanentDelegations.confirmation.cancel')"
      :isConfirmButtonLoading="isDeleting"
      data-testid="permanent-delegation-confirmation-modal"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PAlert,
  PLoader,
  PTable,
  PTableColumn,
  PDoubleText,
  PButton,
  PIcon,
} from '@pulse/styleguide/components'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import { useI18n } from 'vue-i18n'
import { getInitials, formatDateToLocale } from '@entities/helpers'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import { usePermanentDelegations } from './permanent-delegations.composable'
import DeleteDelegationModal from './components/delete-delegation-modal/delete-delegation-modal.vue'
import { DelegationTrackingManager } from '@entities/managers/delegation-tracking/delegation-tracking.manager'
import type { PermanentDelegationItem, PermanentDelegationsProps } from './permanent-delegations.types'

const props = defineProps<PermanentDelegationsProps>()

const { t } = useI18n()

const { permanentDelegations, isLoading, removeDelegation } = usePermanentDelegations(props.initialData)

const isConfirmationDialogVisible = ref(false)
const isDeleting = ref(false)
const delegationToDelete = ref<PermanentDelegationItem | null>(null)

const confirmationTitle = computed(() => {
  if (delegationToDelete.value === null) {
    return ''
  }
  const { firstName, lastName } = delegationToDelete.value.delegatee
  return t('entities.permanentDelegations.confirmation.title', {
    name: getFullNameWithUppercaseLastName(firstName, lastName),
  })
})

function openConfirmationDialog(delegation: PermanentDelegationItem) {
  DelegationTrackingManager.trackPermanentDeleteRequested()
  delegationToDelete.value = delegation
  isConfirmationDialogVisible.value = true
}

async function handleConfirmDelete() {
  if (delegationToDelete.value === null) {
    return
  }

  const { firstName, lastName } = delegationToDelete.value.delegatee
  const delegateeName = getFullNameWithUppercaseLastName(firstName, lastName)

  isDeleting.value = true
  try {
    await removeDelegation(delegationToDelete.value)
    isConfirmationDialogVisible.value = false
    delegationToDelete.value = null
    displayNotification('success', t('entities.permanentDelegations.notification.deleteSuccess', { name: delegateeName }))
  } catch {
    displayNotification('error', t('entities.permanentDelegations.notification.deleteError', { name: delegateeName }))
  } finally {
    isDeleting.value = false
  }
}
</script>
