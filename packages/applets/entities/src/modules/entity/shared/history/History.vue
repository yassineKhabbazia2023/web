<template>
  <div class="margin-top--6">
    <div
      class="
        flex
        flex--align-items-flex-end
        flex--gap-4
        margin-bottom--6
      "
    >
      <HistorySearch v-model:search="search" class="flex--grow-1 max-width-800" />
      <PButton
        class="flex--shrink-0 margin-left--4"
        pType="secondary"
        pSize="small"
        data-testid="history-filter-button"
        @click="handleOpenFiltersDrawer"
      >
        <PPastille
          v-if="activeFiltersCount > 0"
          pType="white"
          pSize="small"
          class="margin-right--2"
        >
          {{ activeFiltersCount }}
        </PPastille>
        <PIcon pName="sliders" class="margin-right--2" />
        {{ t('filterButton') }}
      </PButton>
      <PButton
        class="flex--shrink-0 margin-left--1"
        pPlain
        pSize="small"
        data-testid="history-reset-button"
        @click="resetFilters"
      >
        {{ t('resetButton') }}
      </PButton>
    </div>

    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <div v-if="isLoading === false">
      <NoResult v-if="activities.length === 0" />

      <template v-if="activities.length > 0">
        <PScrollbar
          pHeight="calc(100vh - 320px)"
          pViewStyle="margin-right: 8px; height: 100%;"
        >
          <PTimeline>
            <PTimelineItem
              v-for="activity in activities"
              :key="activity.activityId"
            >
              <PHistoryCard
                :pDate="formatDate(activity.creationDate)"
                pDateColor="dark-green"
                :pTime="formatTime(activity.creationDate)"
                :pType="activity.action.category.theme.name"
                :pEntity="activity.action.category.name"
                :pHasAccordion="hasDetails(activity.details)"
              >
                <template #text>
                  <div class="history-card__content">
                    <p class="font-semibold">
                      {{ activity.label }}
                    </p>
                  </div>
                </template>
                <template v-if="hasDetails(activity.details)" #details>
                  <div class="history-card__details padding-y--2 font-semibold">
                    <template v-if="hasBulletPoints(activity.details)">
                      <p
                        v-if="getIntroText(activity.details) !== ''"
                        class="margin-bottom--2"
                      >
                        {{ getIntroText(activity.details) }}
                      </p>
                      <ul class="history-card__list padding-left--6">
                        <li
                          v-for="(line, index) in getBulletPoints(activity.details)"
                          :key="index"
                          class="margin-bottom--1"
                        >
                          {{ line }}
                        </li>
                      </ul>
                    </template>
                    <p v-else class="history-card__text">
                      {{ activity.details }}
                    </p>
                  </div>
                </template>
              </PHistoryCard>
            </PTimelineItem>
          </PTimeline>
        </PScrollbar>

        <PPagination
          v-model:p-page-size="pageSize"
          class="margin-top--6"
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
      </template>
    </div>

    <HistoryFiltersDrawer
      v-model:is-opened="isFiltersDrawerOpened"
      :themes="themes"
      :selected-category-ids="selectedCategoryIds"
      :date-range="dateRange"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PButton,
  PHistoryCard,
  PIcon,
  PLoader,
  PPagination,
  PPastille,
  PScrollbar,
  PTimeline,
  PTimelineItem,
} from '@pulse/styleguide/components'
import { formatTime } from '@pulse/toolbox/utils/dates'
import { RouteParam } from '@pulse/common/enums'
import { PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { RouterHelpers } from '@pulse/common/helpers'
import NoResult from '@entities/components/NoResult'
import { getBulletPoints, getIntroText, hasBulletPoints, hasDetails } from './utils/history.utils'
import { useHistory } from './composable/history.composable'
import HistorySearch from './components/HistorySearch.vue'
import HistoryFiltersDrawer from './components/HistoryFiltersDrawer/HistoryFiltersDrawer.vue'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
  messages: {
    'en-US': {
      on: 'on',
      filterButton: 'Filter',
      resetButton: 'Reset',
    },
    'fr-FR': {
      on: 'sur',
      filterButton: 'Filtrer',
      resetButton: 'Réinitialiser',
    },
  },
})

const route = useRoute()
const currentAccountId = computed(() => RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID))
const search = ref('')
const isFiltersDrawerOpened = ref(false)

const {
  isLoading,
  activities,
  currentPage,
  pageSize,
  totalItems,
  themes,
  selectedCategoryIds,
  dateRange,
  activeFiltersCount,
  applyFilters,
  resetFilters,
  onUpdateCurrentPage,
  onPageRangeChanged,
} = useHistory(currentAccountId, search)

const handleOpenFiltersDrawer = () => {
  isFiltersDrawerOpened.value = true
}

const paginationLabel = computed(() => getPaginationLabel(t('on'), {
  currentPage: currentPage.value,
  limit: pageSize.value,
  data: activities.value,
  totalItems: totalItems.value,
}))

const formatDate = (dateString: string): string => {
  return d(new Date(dateString), 'short')
}
</script>

<style lang="scss" scoped>
.history-card {
  &__content {
    max-width: 800px;
  }

  &__details {
    color: var(--p-jungle-400);
  }

  &__list {
    list-style: disc;
  }

  &__text {
    white-space: pre-wrap;
  }
}
</style>

