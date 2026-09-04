<template>
  <div>
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

    <template v-else>
      <PTable
        class="width--100"
        :pData="items"
        pStripe
        pTestId="pending-requests-table"
        :pEmptyText="t('entities.pendingRequests.emptyState')"
        @selection-change="handleSelectionChange"
      >
        <PTableColumn
          pMinWidth="180"
          :pLabel="t('entities.pendingRequests.table.legalName')"
        >
          <template #default="scope">
            {{ scope.row.account.legalName }}
          </template>
        </PTableColumn>

        <PTableColumn
          pMinWidth="130"
          :pLabel="t('entities.pendingRequests.table.customerCode')"
        >
          <template #default="scope">
            {{ scope.row.account.accountNumber }}
          </template>
        </PTableColumn>

        <PTableColumn
          pMinWidth="200"
          :pLabel="t('entities.pendingRequests.table.requester')"
        >
          <template #default="scope">
            <div class="flex flex--align-items-center">
              <div class="margin-right--2">
                <PAvatar
                  :pRole="AvatarRoles.COLLAB"
                  pType="small"
                >
                  {{ getInitials(scope.row.requester.firstName, scope.row.requester.lastName) }}
                </PAvatar>
              </div>
              <div>{{ getRequesterFullName(scope.row) }}</div>
            </div>
          </template>
        </PTableColumn>

        <PTableColumn
          pMinWidth="130"
          :pLabel="t('entities.pendingRequests.table.requestedAt')"
        >
          <template #default="scope">
            {{ d(scope.row.createdAt) }}
          </template>
        </PTableColumn>

        <PTableColumn
          :pShowOverflowTooltip="false"
          pType="selection"
        />
      </PTable>

      <PPagination
        v-model:p-page-size="pageSize"
        class="margin-top--6"
        pTestId="pending-requests"
        :pCurrentPage="currentPage"
        :pTotal="totalItems"
        :pPageSizes="PAGE_SIZES"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        @update:p-current-page="changePage"
        @on-page-range-changed="changePageSize"
      />

      <div
        class="
          flex
          flex--justify-content-flex-end
          margin-top--6
        "
      >
        <PButton
          pSize="default"
          pType="danger"
          class="margin-right--2"
          :pDisabled="isActionButtonDisabled"
          :pLoading="isRefusing"
          pTestId="pending-requests-refuse-button"
          @click="handleRefuse"
        >
          {{ t('entities.pendingRequests.refuseButton') }}
        </PButton>

        <PButton
          pType="primary"
          :pDisabled="isActionButtonDisabled"
          :pLoading="isAccepting"
          pTestId="pending-requests-accept-button"
          @click="handleAccept"
        >
          <PIcon
            pName="check"
            class="margin-right--2"
          />
          {{ t('entities.pendingRequests.acceptButton', { count: selectedIds.length }) }}
        </PButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PLoader,
  PTable,
  PTableColumn,
  PAvatar,
  PPagination,
  PButton,
  PIcon,
} from '@pulse/styleguide/components'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import { PAGE_SIZES } from '@pulse/common/constants'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import { getInitials } from '@entities/helpers'
import { usePendingRequests } from './pending-requests.composable'
import type { PendingRequestItem } from './pending-requests.types'

const emit = defineEmits<{
  'update:pending-requests-count': [number]
}>()

const { t, d } = useI18n()

const {
  items,
  isLoading,
  currentPage,
  pageSize,
  totalItems,
  selectedIds,
  isAccepting,
  isRefusing,
  changePage,
  changePageSize,
  acceptSelected,
  refuseSelected,
} = usePendingRequests()

const hasNoSelection = computed(() => selectedIds.value.length === 0)
const isActionButtonDisabled = computed(() => hasNoSelection.value || isAccepting.value || isRefusing.value)

watch(totalItems, (value) => emit('update:pending-requests-count', value))

function handleSelectionChange(rows: PendingRequestItem[]) {
  selectedIds.value = rows.map((row) => row.delegationRequestId)
}

function getRequesterFullName(row: PendingRequestItem) {
  return getFullNameWithUppercaseLastName(row.requester.firstName, row.requester.lastName)
}

async function handleAccept() {
  try {
    await acceptSelected()
    displayNotification('success', t('entities.pendingRequests.notification.acceptSuccess'))
  } catch {
    displayNotification('error', t('entities.pendingRequests.notification.acceptError'))
  }
}

async function handleRefuse() {
  try {
    await refuseSelected()
    displayNotification('success', t('entities.pendingRequests.notification.refuseSuccess'))
  } catch {
    displayNotification('error', t('entities.pendingRequests.notification.refuseError'))
  }
}
</script>
