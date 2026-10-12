<template>
  <div class="margin-top--2">
    <PEntityHeader
      v-if="currentEntity !== undefined"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      class="margin-bottom--4"
    />

    <div
      class="
        flex
        flex--justify-content-space-between
        flex--align-items-center
        flex-gap--3
        bg--surface-basic-primary
        shadow--6
        padding-x--4
        padding-y--3
        margin-bottom--6
      "
      style="border-bottom: 1px solid var(--p-stroke-neutral-neutral)"
    >
      <PFormSearch
        v-model:pSearch="search"
        class="max-width-800 flex--grow-1"
        :pPlaceholder="t('entities.seresInvoices.searchPlaceholder')"
        :pSearchInvalidMessage="t('entities.seresInvoices.searchInvalidMessage')"
        pClearable
        pSize="small"
        pTestId="seres-invoices-search"
      />

      <PButton
        v-if="isCtaVisible"
        pType="primary"
        pTestId="old-rydge-invoices-cta"
        @click="openDialog"
      >
        {{ t('entities.seresInvoices.oldInvoicesDialog.ctaLabel') }}
        <PIcon
          pName="arrowRight"
          pSize="16"
          class="margin-left--2"
        />
      </PButton>
    </div>

    <div
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        flex--align-items-center
      "
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <div v-show="isLoading === false">
      <PTable
        :pData="invoices"
        :pEmptyText="emptyStateMessage"
        pRowKey="id"
        pStripe
        pTestId="seres-invoices-table"
        @sort-change="onSortChange"
      >
        <PTableColumn
          :pLabel="t('entities.seresInvoices.columns.name')"
          pProp="name"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        />
        <PTableColumn
          :pLabel="t('entities.seresInvoices.columns.depositDate')"
          pProp="depositDate"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        >
          <template #default="scope">
            {{ d(new Date(scope.row.depositDate), 'short') }}
          </template>
        </PTableColumn>
        <PTableColumn
          :pLabel="t('entities.seresInvoices.columns.year')"
          pProp="invoiceYear"
          pSortable="custom"
          :pSortOrders="SORT_ORDERS"
        />
        <PTableColumn
          :pLabel="t('entities.seresInvoices.columns.actions')"
          :pWidth="120"
        >
          <template #default="scope">
            <div class="flex flex--gap-4">
              <PTooltip
                :pContent="t('entities.seresInvoices.viewLabel')"
                :pHideAfter="0"
              >
                <PButton
                  pIconOnly
                  pSize="small"
                  :pLoading="isActionProcessing(scope.row, SeresInvoiceAction.VIEW)"
                  :pDisabled="isInvoiceLocked(scope.row)"
                  :aria-label="t('entities.seresInvoices.viewLabel')"
                  :pTestId="`seres-invoices-view-button-${scope.row.id}`"
                  @click="viewInvoice(scope.row)"
                >
                  <PIcon pName="eye" />
                </PButton>
              </PTooltip>
              <PTooltip
                :pContent="t('entities.seresInvoices.downloadLabel')"
                :pHideAfter="0"
              >
                <PButton
                  pIconOnly
                  pSize="small"
                  :pLoading="isActionProcessing(scope.row, SeresInvoiceAction.DOWNLOAD)"
                  :pDisabled="isInvoiceLocked(scope.row)"
                  :aria-label="t('entities.seresInvoices.downloadLabel')"
                  :pTestId="`seres-invoices-download-button-${scope.row.id}`"
                  @click="downloadInvoice(scope.row)"
                >
                  <PIcon pName="download" />
                </PButton>
              </PTooltip>
            </div>
          </template>
        </PTableColumn>
      </PTable>

      <PPagination
        v-if="invoices.length > 0"
        class="margin-top--6"
        :pPageSize="pageSize"
        :pCurrentPage="currentPage"
        :pTotal="totalItems"
        :pPageSizes="PAGE_SIZES"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        @update:p-current-page="onUpdateCurrentPage"
        @on-page-range-changed="onPageRangeChanged"
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>
    </div>

    <OldRydgeInvoicesDialog
      v-model="isDialogOpen"
      :login-url="loginUrl"
      @login-click="handleLoginClick"
      @assistance-click="handleAssistanceClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PButton,
  PEntityHeader,
  PFormSearch,
  PIcon,
  PLoader,
  PPagination,
  PTable,
  PTableColumn,
  PTooltip,
} from '@pulse/styleguide/components'
import { RouteParam } from '@pulse/common/enums'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PAGE_SIZES, SORT_ORDERS } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { RouterHelpers } from '@pulse/common/helpers'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { useSeresInvoices } from './seres-invoices.composable'
import { useSeresInvoicesDownload } from './seres-invoices-download.composable'
import { SeresInvoiceAction } from './seres-invoices.enums'
import OldRydgeInvoicesDialog from './old-rydge-invoices-dialog/old-rydge-invoices-dialog.vue'
import { useOldRydgeInvoicesDialog } from './old-rydge-invoices-dialog/old-rydge-invoices-dialog.composable'

const { d, t } = useI18n()

const route = useRoute()
const currentAccountId = computed(() => RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID))

const { currentEntity } = storeToRefs(useCurrentEntityStore())

const search = ref('')

const {
  isLoading,
  invoices,
  currentPage,
  pageSize,
  totalItems,
  onUpdateCurrentPage,
  onPageRangeChanged,
  onSortChange,
} = useSeresInvoices(currentAccountId, search)

const { isInvoiceLocked, isActionProcessing, viewInvoice, downloadInvoice } = useSeresInvoicesDownload()

const {
  isCtaVisible,
  isDialogOpen,
  loginUrl,
  openDialog,
  handleLoginClick,
  handleAssistanceClick,
} = useOldRydgeInvoicesDialog()

const emptyStateMessage = computed(() => isNotNullNorEmpty(search.value)
  ? t('entities.seresInvoices.noSearchResult')
  : t('entities.seresInvoices.noInvoice'))

const paginationLabel = computed(() => getPaginationLabel(t('entities.seresInvoices.on'), {
  currentPage: currentPage.value,
  limit: pageSize.value,
  data: invoices.value,
  totalItems: totalItems.value,
}))
</script>
