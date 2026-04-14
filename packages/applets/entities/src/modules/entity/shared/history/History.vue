<template>
  <div class="margin-top--6">
    <HistorySearch v-model:search="search" class="max-width-800 margin-bottom--6" />

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
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@pulse/toolbox/utils/dates'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PHistoryCard,
  PLoader,
  PPagination,
  PScrollbar,
  PTimeline,
  PTimelineItem,
} from '@pulse/styleguide/components'
import { RouteParam } from '@pulse/common/enums'
import { PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { RouterHelpers } from '@pulse/common/helpers'
import NoResult from '@entities/components/NoResult'
import { getBulletPoints, getIntroText, hasBulletPoints, hasDetails } from './utils/history.utils'
import { useHistory } from './composable/history.composable'
import HistorySearch from './components/HistorySearch.vue'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
  messages: {
    'en-US': {
      on: 'on',
    },
    'fr-FR': {
      on: 'sur',
    },
  },
})

const route = useRoute()
const currentAccountId = computed(() => RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID))
const search = ref('')

const {
  isLoading,
  activities,
  currentPage,
  pageSize,
  totalItems,
  onUpdateCurrentPage,
  onPageRangeChanged,
} = useHistory(currentAccountId, search)

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

