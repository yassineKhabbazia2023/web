<template>
  <PDrawer
    v-model="isAccountFilterDrawerVisible"
    class="flex"
    pSize="40%"
    :pTitle="t('filters')"
    destroyOnClose
    data-testid="account-filters-drawer"
    @close="closeAccountFiltersDrawer"
    @open="initializeFilters"
    @close-drawer-button="closeAccountFiltersDrawer"
  >
    <PForm
      :pModel="internalFilters"
      pLabelPosition="top"
      @submit.prevent
    >
      <PFormItem :pLabel="t('favorites')">
        <PFilterOption
          v-model:p-selected="internalFilters.isFavoriteFilter"
          :pContent="t('favorites')"
          pColor="default"
          data-testid="filter-Favorites"
        />
      </PFormItem>
      <PFormItem
        v-if="isCollab"
        :pLabel="t('customerRelationship')"
      >
        <PFilterOption
          v-model:p-selected="internalFilters.isCustomerRelationFilter"
          :pContent="t('customerRelationship')"
          pColor="default"
          data-testid="filter-CustomerRelationship"
        />
      </PFormItem>
      <PFormItem
        v-for="group in MULTI_SELECT_FILTER_GROUPS"
        :key="group.field"
        :pLabel="t(group.labelKey)"
      >
        <PFilterOption
          :pContent="t('all')"
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
            :pContent="t(option.labelKey)"
            pColor="default"
            :pSelected="(internalFilters[group.field] ?? []).includes(option.value)"
            :data-testid="`filter-${option.value}`"
            @update:p-selected="toggleValue(group.field, option.value, $event)"
          />
        </div>
      </PFormItem>
      <PFormItem :pLabel="t('lastActivityPeriod')">
        <PFilterOption
          :pContent="t('all')"
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
            :pContent="t(option.labelKey)"
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
import { MULTI_SELECT_FILTER_GROUPS, LAST_ACTIVITY_PERIOD_OPTIONS } from './account-filters-drawer.consts'
import type { LastActivityPeriodInDays } from '@entities/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      filters: 'Filters',
      online: 'Online',
      apply: 'Apply',
      offline: 'Offline',
      reset: 'Reset',
      initialized: 'Initialized',
      failed: 'Failure',
      placeholderTypeReport: 'Select a type',
      favorites: 'Favorites',
      customerRelationship: 'Customer Relationship',
      missionType: 'Mission type',
      revision: 'Account review',
      status: 'Status',
      tenue: 'Bookkeeping',
      notSpecified: 'Not specified',
      toDeploy: 'To deploy',
      inProgress: 'In progress',
      connected: 'Connected',
      all: 'All',
      lastActivityPeriod: 'Last activity',
      lastTwoWeeks: 'Last 2 weeks',
      lastThirtyDays: 'Last 30 days',
      lastNinetyDays: 'Last 90 days',
    },
    'fr-FR': {
      filters: 'Filtres',
      online: 'En ligne',
      offline: 'Hors ligne',
      apply: 'Appliquer',
      reset: 'Réinitialiser',
      initialized: 'Initialisé',
      failed: 'Incident',
      placeholderTypeReport: 'Sélectionnez un type',
      favorites: 'Favoris',
      customerRelationship: 'Relation client',
      missionType: 'Type de mission',
      revision: 'Révision',
      status: 'Statut',
      tenue: 'Tenue',
      notSpecified: 'Non renseigné',
      toDeploy: 'À déployer',
      inProgress: 'En cours',
      connected: 'Connecté',
      all: 'Tout',
      lastActivityPeriod: 'Dernière activité',
      lastTwoWeeks: '2 dernières semaines',
      lastThirtyDays: '30 derniers jours',
      lastNinetyDays: '90 derniers jours',
    },
  },
})

const props = defineProps<AccountFiltersDrawerProps>()
const emit = defineEmits<{
  'apply-filters': [AccountFilters]
  'reset-filters': []
}>()

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const internalFilters = ref<AccountFilters>(getDefaultAccountFilters())
const hasActiveFilters = defineModel<boolean>('hasActiveFilters', {
  default: false,
})

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('reset'),
  pDisabled: hasActiveFilters.value === false,
  pTestId: 'account-filters-drawer__reset-button',
}))
const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('apply'),
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
