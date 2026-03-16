<template>
  <div class="subscription-status-filters">
    <div
      class="
        margin-bottom--2
        font-semibold
        font-small
        text-color--neutral-gray-500
      "
    >
      {{ t('entities.wallet.subscriptionStatusFilters.activateOffers') }}
    </div>
    <div class="flex">
      <PFilterGroupSubscriptionStatus
        v-model="activeStatusCodes"
        :pFilters="offerActivationFilters"
        class="subscription-status-filters__filter-group--with-separator padding-right--3"
      />
      <!-- Validated filter is not yet interactive - will be implemented in a future iteration -->
      <PFilterGroupSubscriptionStatus
        :modelValue="[]"
        :pFilters="validatedFilters"
        class="padding-left--3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { PFilterGroup } from '@pulse/styleguide/components'
import type { FilterOption } from '@pulse/styleguide/types'
import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import { fetchSubscriptionStats } from '@entities/services/subscription'
import { SubscriptionStatusFiltersManager } from './subscription-status-filters.manager'

const { t } = useI18n()

const activeStatusCodes = defineModel<SubscriptionStatusCode[]>({ required: true })

const PFilterGroupSubscriptionStatus = PFilterGroup<SubscriptionStatusCode>

const offerActivationFilters = ref<FilterOption<SubscriptionStatusCode>[]>([])
const validatedFilters = ref<FilterOption<SubscriptionStatusCode>[]>([])

onMounted(async () => {
  try {
    const stats = await fetchSubscriptionStats()
    offerActivationFilters.value = SubscriptionStatusFiltersManager.getOfferActivationFilters(stats)
    validatedFilters.value = SubscriptionStatusFiltersManager.getValidatedFilters(stats)
  } catch (err) {
    logger.error(err)
  }
})
</script>

<style lang="scss" scoped>
.subscription-status-filters {
  &__filter-group {
    &--with-separator {
      height: 32px;
      border-right: 1px solid var(--p-gray-100);
    }
  }
}
</style>
