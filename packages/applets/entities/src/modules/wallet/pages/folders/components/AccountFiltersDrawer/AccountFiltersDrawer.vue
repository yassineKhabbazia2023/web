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
    >
      <!-- Favorites Switch -->
      <PFormItem>
        <PSwitch
          v-model="internalFilters.isFavoriteFilter"
          :pActiveText="t('favorites')"
        />
      </PFormItem>
      <!-- Customer Relationship Switch -->
      <PFormItem v-if="isCollab === true">
        <PSwitch
          v-model="internalFilters.isCustomerRelationFilter"
          :pActiveText="t('customerRelationship')"
        />
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
import { PDrawer, PDrawerActions, PForm, PFormItem, PSwitch } from '@pulse/styleguide/components'
import type { PDrawerActionButton } from '@pulse/styleguide/types'
import type { AccountFiltersDrawerProps } from './account-filters-drawer.types'
import { useUserStore } from '@pulse/common/stores'
import type { AccountFilters } from '@entities/types'
import { storeToRefs } from 'pinia'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'

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

const backCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('reset'),
  pDisabled: hasActiveFilters.value === false,
  pTestId: 'account-filters-drawer__reset-button',
}))
const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('apply'),
  pTestId: 'account-filters-drawer__apply-button',
}))

// #region Actions Related to Filters
const internalFilters = ref<AccountFilters>({
  isFavoriteFilter: false,
  isCustomerRelationFilter: false,
})
const hasActiveFilters = defineModel<boolean>('hasActiveFilters', {
  default: false,
})
const applyAccountFilters = () => {
  WalletTrackingManager.trackCustomFilterValidated(internalFilters.value)
  hasActiveFilters.value = true
  emit('apply-filters', internalFilters.value)
}
const resetAccountFilters = () => {
  hasActiveFilters.value = false
  emit('reset-filters')
}
// #endregion

// #region Drawer State and Event Handlers
const isAccountFilterDrawerVisible = defineModel<boolean>({
  default: false,
})
const initializeFilters = () => {
  internalFilters.value = {
    isFavoriteFilter: props.accountFilters.isFavoriteFilter,
    isCustomerRelationFilter: props.accountFilters.isCustomerRelationFilter,
  }
}
const closeAccountFiltersDrawer = () => {
  if (!hasActiveFilters.value) {
    internalFilters.value = { isFavoriteFilter: false, isCustomerRelationFilter: false }
  }
  isAccountFilterDrawerVisible.value = false
}
// #endregion
</script>
