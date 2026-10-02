<template>
  <PDrawer
    v-model="isAccountFilterDrawerVisible"
    class="flex"
    pSize="40%"
    :pTitle="t(`${ACCOUNT_FILTERS_I18N_KEY}.filters`)"
    destroyOnClose
    data-testid="account-filters-drawer"
    @close="closeAccountFiltersDrawer"
    @open="initializeFilters"
    @close-drawer-button="closeAccountFiltersDrawer"
  >
    <PForm
      :pModel="internalFilters"
      @submit.prevent
    >
      <PFormItem :pLabel="t(`${ACCOUNT_FILTERS_I18N_KEY}.favorites`)">
        <PFilterOption
          v-model:p-selected="internalFilters.isFavoriteFilter"
          :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.favorites`)"
          pColor="default"
          data-testid="filter-Favorites"
        />
      </PFormItem>
      <PFormItem
        v-if="isCollab"
        :pLabel="t(`${ACCOUNT_FILTERS_I18N_KEY}.customerRelationship`)"
      >
        <PFilterOption
          v-model:p-selected="internalFilters.isCustomerRelationFilter"
          :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.customerRelationship`)"
          pColor="default"
          data-testid="filter-CustomerRelationship"
        />
      </PFormItem>
      <PFormItem
        v-for="group in visibleFilterGroups"
        :key="group.field"
        :pLabel="t(`${ACCOUNT_FILTERS_I18N_KEY}.${group.labelKey}`)"
      >
        <PFilterOption
          :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.all`)"
          pColor="default"
          :pSelected="isAllSelected(group)"
          @update:p-selected="toggleAll(group, $event)"
        />
        <PDivider
          p-border-style="solid"
          pDirection="vertical"
          pBorderColor="gray-200"
        />
        <div
          class="
            flex
            flex--wrap
            flex-gap--2
          "
        >
          <PFilterOption
            v-for="option in group.options"
            :key="option.value"
            :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.${option.labelKey}`)"
            pColor="default"
            :pSelected="(internalFilters[group.field] ?? []).includes(option.value)"
            :data-testid="`filter-${option.value}`"
            @update:p-selected="toggleValue(group.field, option.value, $event)"
          />
        </div>
      </PFormItem>
      <PFormItem
        :pLabel="t(`${ACCOUNT_FILTERS_I18N_KEY}.lastActivityPeriod`)"
      >
        <PFilterOption
          :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.all`)"
          pColor="default"
          :pSelected="internalFilters.lastActivityPeriodFilter === undefined"
          data-testid="filter-last-activity-period-all"
          @update:p-selected="clearLastActivityPeriod"
        />
        <PDivider
          pBorderStyle="solid"
          pDirection="vertical"
          pBorderColor="gray-200"
        />
        <div
          class="
            flex
            flex--wrap
            flex-gap--2
          "
        >
          <PFilterOption
            v-for="option in LAST_ACTIVITY_PERIOD_OPTIONS"
            :key="option.value"
            :pContent="t(`${ACCOUNT_FILTERS_I18N_KEY}.${option.labelKey}`)"
            pColor="default"
            :pSelected="internalFilters.lastActivityPeriodFilter === option.value"
            :data-testid="`filter-last-activity-period-${option.value}`"
            @update:p-selected="toggleLastActivityPeriod(option.value, $event)"
          />
        </div>
      </PFormItem>
    </PForm>
    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="resetAccountFilters"
        @click-primary-cta="applyAccountFilters"
      />
    </template>
  </PDrawer>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PFilterOption, PForm, PFormItem, PDivider } from '@pulse/styleguide/components'
import type { PDrawerActionButton } from '@pulse/styleguide/types'
import type { AccountFiltersDrawerProps, FilterGroupConfig, MultiSelectFilterField } from './account-filters-drawer.types'
import { useUserStore } from '@pulse/common/stores'
import type { AccountFilters } from '@entities/types'
import { storeToRefs } from 'pinia'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import { getDefaultAccountFilters } from './account-filters-drawer.utils'
import { ACCOUNT_FILTERS_I18N_KEY, MULTI_SELECT_FILTER_GROUPS, LAST_ACTIVITY_PERIOD_OPTIONS } from './account-filters-drawer.consts'
import type { LastActivityPeriodInDays } from '@entities/enums'

const { t } = useI18n()

const props = defineProps<AccountFiltersDrawerProps>()
const emit = defineEmits<{
  'apply-filters': [AccountFilters]
  'reset-filters': []
}>()

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

// Mission type and status filters are reserved for collaborators
const visibleFilterGroups = computed(() => (isCollab.value ? MULTI_SELECT_FILTER_GROUPS : []))

const internalFilters = ref<AccountFilters>(getDefaultAccountFilters())
const hasActiveFilters = defineModel<boolean>('hasActiveFilters', {
  default: false,
})

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t(`${ACCOUNT_FILTERS_I18N_KEY}.reset`),
  pDisabled: hasActiveFilters.value === false,
  pTestId: 'account-filters-drawer__reset-button',
}))
const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t(`${ACCOUNT_FILTERS_I18N_KEY}.apply`),
  pTestId: 'account-filters-drawer__apply-button',
}))

// #region Filter helpers
const isAllSelected = (group: FilterGroupConfig) =>
  group.options.every(({ value }) => (internalFilters.value[group.field] ?? []).includes(value))

const toggleAll = (group: FilterGroupConfig, isOn: boolean) => {
  internalFilters.value[group.field] = isOn ? group.options.map(o => o.value) : []
}

const toggleValue = (field: MultiSelectFilterField, value: string, isOn: boolean) => {
  const current = internalFilters.value[field] ?? []
  internalFilters.value[field] = isOn
    ? [...current, value]
    : current.filter(v => v !== value)
}

const toggleLastActivityPeriod = (period: LastActivityPeriodInDays, isOn: boolean) => {
  internalFilters.value.lastActivityPeriodFilter = isOn ? period : undefined
}

const clearLastActivityPeriod = () => {
  internalFilters.value.lastActivityPeriodFilter = undefined
}
// #endregion

// #region Filter Actions
const hasAppliedAccountFilters = (filters: AccountFilters) =>
  filters.isFavoriteFilter ||
  filters.isCustomerRelationFilter ||
  (filters.missionTypeFilter?.length ?? 0) > 0 ||
  (filters.deploymentStatusFilter?.length ?? 0) > 0 ||
  filters.lastActivityPeriodFilter !== undefined

const applyAccountFilters = () => {
  WalletTrackingManager.trackCustomFilterValidated(internalFilters.value)
  hasActiveFilters.value = hasAppliedAccountFilters(internalFilters.value)
  emit('apply-filters', { ...internalFilters.value })
}

const resetAccountFilters = () => {
  hasActiveFilters.value = false
  internalFilters.value = getDefaultAccountFilters()
  emit('reset-filters')
}
// #endregion

// #region Drawer State
const isAccountFilterDrawerVisible = defineModel<boolean>({
  default: false,
})

const initializeFilters = () => {
  internalFilters.value = {
    ...props.accountFilters,
    missionTypeFilter: props.accountFilters.missionTypeFilter?.slice(),
    deploymentStatusFilter: props.accountFilters.deploymentStatusFilter?.slice(),
  }
}

const closeAccountFiltersDrawer = () => {
  if (hasActiveFilters.value === false) {
    internalFilters.value = getDefaultAccountFilters()
  }
  isAccountFilterDrawerVisible.value = false
}
// #endregion
</script>
