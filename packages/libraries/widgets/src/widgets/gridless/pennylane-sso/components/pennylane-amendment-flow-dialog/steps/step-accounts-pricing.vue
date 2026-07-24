<template>
  <div>
    <h2 class="font-bold margin-bottom--4">
      {{ t('widgets.pennylaneAmendmentFlow.step2.title') }}
    </h2>

    <p class="margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step2.reformDescription') }}
    </p>

    <!-- Desktop: Table -->
    <div
      v-if="isMobile === false"
      class="table-scroll-wrapper"
    >
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
            <div class="flex flex--align-items-center flex--justify-content-center width--100">
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
            <div class="flex flex--align-items-center flex--justify-content-center width--100">
              <PIcon
                pName="pennylaneColor"
                pSize="20"
                class="margin-right--2"
              />
              <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.step2.table.subscription') }}</span>
              <span
                v-if="isFoodServiceCompany === false"
                class="font-bold"
              >
                {{ t('widgets.pennylaneAmendmentFlow.step2.table.doubleStars') }}
              </span>
            </div>
          </template>
          <template #default="{ row }">
            <span class="accounts-pricing-table__subscription-text">{{ row.subscriptionPrice }}</span>
          </template>
        </PTableColumn>
      </PTable>
    </div>

    <!-- Mobile: Cards -->
    <div
      v-if="isMobile === true"
      class="accounts-pricing-cards"
    >
      <div
        v-for="(account, index) in tableData"
        :key="index"
        class="
          accounts-pricing-card
          radius--8
          margin-bottom--3
          overflow--hidden
        "
      >
        <div class="accounts-pricing-card__header padding--4">
          <span class="accounts-pricing-card__company font-bold">
            {{ account.legalName }}
          </span>
        </div>

        <div
          class="
            accounts-pricing-card__row
            flex
            flex--justify-content-space-between
            flex--align-items-center
            padding--4
          "
        >
          <div class="accounts-pricing-card__label flex flex--align-items-center">
            <PIcon
              pName="scales"
              pSize="16"
              class="margin-right--2"
            />
            <span>{{ t('widgets.pennylaneAmendmentFlow.step2.table.compliance') }}</span>
          </div>
          <div class="accounts-pricing-card__value font-bold">
            {{ account.compliancePrice }}
          </div>
        </div>

        <div
          class="
            accounts-pricing-card__row
            flex
            flex--justify-content-space-between
            flex--align-items-center
            padding--4
          "
        >
          <div class="accounts-pricing-card__label flex flex--align-items-center">
            <PIcon
              pName="pennylaneColor"
              pSize="16"
              class="margin-right--2"
            />
            <span>{{ t('widgets.pennylaneAmendmentFlow.step2.table.subscription') }}</span>
            <span
              v-if="isFoodServiceCompany === false"
              class="font-bold"
            >
              {{ t('widgets.pennylaneAmendmentFlow.step2.table.doubleStars') }}
            </span>
          </div>
          <div class="accounts-pricing-card__value font-bold">
            {{ account.subscriptionPrice }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="margin-y--6"
    >
      <p class="font-base margin--0">
        {{ t('widgets.pennylaneAmendmentFlow.step2.table.complianceNote') }}
      </p>
      <template
        v-if="isFoodServiceCompany === false"
      >
        <p
          v-if="isFreeTrialExpired"
          class="font-base margin--0"
        >
          {{ t('widgets.pennylaneAmendmentFlow.step2.table.subscriptionNoteExpired') }}
        </p>
        <p
          v-else
          class="font-base margin--0"
        >
          {{ t('widgets.pennylaneAmendmentFlow.step2.table.subscriptionNote', {
            billingMonth: freeTrialInfo?.billingMonth
          }) }}
        </p>
      </template>
    </div>

    <PAlert
      v-if="isFreeTrialExpired === false && isFoodServiceCompany === false"
      pType="success"
      class="font-base"
    >
      {{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionPart1') }}
      <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionBold') }}</span>
      {{ t('widgets.pennylaneAmendmentFlow.step2.freeAccessNotice.descriptionPart2', {
        freeTrialEndDate:
          freeTrialInfo?.freeTrialEndDate ? formatDate(freeTrialInfo.freeTrialEndDate) : ''
      }) }}
    </PAlert>

    <Teleport to="#pennylane-amendment-flow-dialog-footer">
      <PAlert
        pType="info"
        class="font-base margin-y--4"
      >
        <div v-if="isDelayedActivation" class="margin-bottom--1">
          {{ t('widgets.pennylaneAmendmentFlow.step2.supportNotice.descriptionDelayed') }}
        </div>
        {{ t('widgets.pennylaneAmendmentFlow.step2.supportNotice.description') }}
      </PAlert>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PAlert, PIcon, PTable, PTableColumn, PTooltip } from '@pulse/styleguide/components'
import type { StepAccountsPricingProps } from './step-accounts-pricing.types'
import { DATE_TIME_FORMATS } from '@pulse/common/i18n'
import { DELAYED_ACTIVATION_DATE } from '../../../pennylane-amendment.consts'
import { PennylaneDeploymentWave } from '../../../pennylane-sso.enums'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
  datetimeFormats: DATE_TIME_FORMATS,
})

const { isMobile } = useResponsive()

const props = defineProps<StepAccountsPricingProps>()

const isDelayedActivation = computed(() => props.freeTrialInfo?.freeTrialEndDate === DELAYED_ACTIVATION_DATE)

const isFreeTrialExpired = computed(() => props.freeTrialInfo?.isFreeTrialExpired === true)

const isFoodServiceCompany = computed(() =>
  props.freeTrialInfo?.wave === PennylaneDeploymentWave.FOOD_SERVICE)

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
  if (isFoodServiceCompany.value === true) {
    return t('widgets.pennylaneAmendmentFlow.step2.table.includedInMission')
  }
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

const formatDate = (dateString: string): string => {
  return d(new Date(dateString), 'longText')
}
</script>

<style lang="scss" scoped>
.table-scroll-wrapper {
  width: 100%;
}

.accounts-pricing-table {
  &__company-cell-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 160px;
  }

  &__subscription-text {
    display: block;
    white-space: normal;
    word-break: break-word;
  }
}

.accounts-pricing-card {
  border: 1px solid var(--p-gray-300);

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    background-color: var(--p-teal-100);
    border-bottom: 1px solid var(--p-gray-200);
  }

  &__company {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__row {
    border-bottom: 1px solid var(--p-gray-200);

    &:last-child {
      border-bottom: none;
    }
  }

  &__label {
    font-size: 14px;
    flex-shrink: 0;
  }

  &__value {
    text-align: right;
    word-break: break-word;
  }
}
</style>
