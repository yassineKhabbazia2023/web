<template>
  <div>
    <h2 class="font-extrabold margin-bottom--4">
      {{ t('widgets.pennylaneAmendmentFlow.step2.title') }}
    </h2>

    <p class="margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step2.reformDescription') }}
    </p>

    <div class="table-scroll-wrapper">
      <PTable
        :pData="tableData"
        :pHeaderCellStyle="headerCellStyle"
        :pCellStyle="cellStyle"
        class="accounts-pricing-table margin-bottom--2"
      >
        <PTableColumn
          pProp="legalName"
          pAlign="left"
          class-name="accounts-pricing-table__company-cell"
          :min-width="140"
        >
          <template #default="{ row }">
            <PTooltip :pContent="row.legalName">
              <span class="accounts-pricing-table__company-cell-text">{{ row.legalName }}</span>
            </PTooltip>
          </template>
        </PTableColumn>
        <PTableColumn
          pProp="compliancePrice"
          pAlign="center"
          class-name="accounts-pricing-table__price-cell"
          :min-width="180"
        >
          <template #header>
            <div class="flex flex--align-items-center flex--justify-content-center width--full">
              <PIcon
                pName="scales"
                pSize="20"
                class="margin-right--2"
              />
              <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.step2.table.compliance') }}</span>
            </div>
          </template>
        </PTableColumn>
        <PTableColumn
          pProp="subscriptionPrice"
          pAlign="center"
          class-name="accounts-pricing-table__price-cell"
          :min-width="200"
        >
          <template #header>
            <div class="flex flex--align-items-center flex--justify-content-center width--full">
              <PIcon
                pName="pennylaneColor"
                pSize="20"
                class="margin-right--2"
              />
              <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.step2.table.subscription') }}</span>
            </div>
          </template>
        </PTableColumn>
      </PTable>
    </div>

    <div class="margin-y--6">
      <p class="font-base margin--0">
        {{ t('widgets.pennylaneAmendmentFlow.step2.table.complianceNote') }}
      </p>
      <p class="font-base margin--0">
        {{ t('widgets.pennylaneAmendmentFlow.step2.table.subscriptionNote') }}
      </p>
    </div>

    <PAlert
      pType="success"
      class="font-base"
    >
      {{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionPart1') }}
      <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionBold') }}</span>
      {{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionPart2') }}
    </PAlert>

    <Teleport to="#pennylane-amendment-flow-dialog-footer">
      <PAlert
        pType="info"
        class="font-base margin-y--4"
      >
        {{ t('widgets.pennylaneAmendmentFlow.step2.supportNotice.description') }}
      </PAlert>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PIcon, PTable, PTableColumn, PTooltip } from '@pulse/styleguide/components'
import type { StepAccountsPricingProps } from './step-accounts-pricing.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<StepAccountsPricingProps>()

const tableData = computed(() => {
  return props.accounts.map((account) => ({
    legalName: account.legalName,
    compliancePrice: formatCompliancePrice(account.compliancePriceExclTax),
    subscriptionPrice: formatSubscriptionPrice(account.planPriceExclTax),
  }))
})

function formatCompliancePrice(price: number): string {
  if (price === 0) {
    return '–'
  }
  return formatPrice(price)
}

function formatSubscriptionPrice(price: number): string {
  if (price === 0) {
    return t('widgets.pennylaneAmendmentFlow.step2.table.free')
  }
  return `${formatPrice(price)} / ${t('widgets.pennylaneAmendmentFlow.step2.table.perMonth')}`
}

function formatPrice(price: number): string {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  return `${formattedPrice} HT`
}

function headerCellStyle() {
  return {
    backgroundColor: 'var(--p-teal-100)',
    color: 'var(--p-black-rock-900)',
  }
}

function cellStyle() {
  return {
    borderBottom: '1px solid var(--p-black-rock-900)',
  }
}
</script>

<style lang="scss" scoped>
.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 350px;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.accounts-pricing-table {
  &__company-cell-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 160px;
  }
}
</style>
