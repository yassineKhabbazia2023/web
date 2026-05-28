<template>
  <div
    v-if="props.isLoading === true"
    class="
      ai-monitoring-table__loader
      flex
      flex--direction-column
      flex--align-items-center
      flex--justify-content-center
      flex-gap--4
    "
  >
    <PLoader
      pType="no-color"
      pSize="60"
    />
    <p class="text-color--neutral-gray-500 font-small text-center margin-top--4">
      Chargement de l'historique des recherches IA...
    </p>
  </div>

  <template v-else>
    <PTable
      v-if="props.history.length > 0"
      data-testid="ai-monitoring-table"
      :pData="props.history"
      empty-text="Aucun historique de recherche IA disponible"
      class="width--100 border-radius--2 ai-monitoring-table"
      pStripe
      :pCellStyle="{ padding: '12px 0px' }"
      :pRowKey="getRowKey"
    >
      <PTableColumn pType="expand" pWidth="50px">
        <template #default="{ row }">
          <div
            class="
              flex
              flex--direction-column
              flex-gap--4
              padding-y--4
            "
          >
            <div
              v-if="row.question !== null && row.question !== ''"
              class="
                bg--gray-50
                border-radius--2
                padding--4
                shadow--1
              "
            >
              <div
                class="
                  flex
                  flex--align-items-center
                  flex-gap--2
                  margin-bottom--2
                "
              >
                <PIcon
                  pName="chatSquareText"
                  pSize="16"
                  :color="AppColors.ICON_NEUTRAL"
                />
                <span class="ai-monitoring-table__section-title">QUESTION DEMANDÉE</span>
              </div>
              <p class="ai-monitoring-table__question-text">
                "{{ row.question }}"
              </p>
            </div>

            <div
              v-if="row.response !== null && row.response.length > 0"
              class="
                bg--teal-100
                border-radius--2
                padding--4
                shadow--1
              "
            >
              <div
                class="
                  flex
                  flex--align-items-center
                  flex-gap--2
                  margin-bottom--2
                "
              >
                <PIcon
                  pName="stars"
                  pSize="16"
                  :color="AppColors.ICON_NEUTRAL"
                />
                <span class="ai-monitoring-table__section-title">RÉPONSE DE L'IA</span>
              </div>
              <div class="flex flex--direction-column flex-gap--2">
                <p
                  v-for="(responseLine, index) in row.response"
                  :key="index"
                  class="ai-monitoring-table__response-text"
                >
                  {{ responseLine }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn
        data-testid="ai-monitoring-table-feature-column"
        pLabel="Fonctionnalité"
        pProp="feature"
        pSortable="custom"
        pMinWidth="120px"
      >
        <template #default="{ row }">
          <span class="font-medium">{{ row.feature }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-subfeature-column"
        pLabel="Sous-fonctionnalité"
        pProp="sub_feature"
        pSortable="custom"
        pMinWidth="120px"
      >
        <template #default="{ row }">
          <PTag
            pSize="default"
            :pColor="getSubFeatureColor(row.sub_feature)"
            :pIconLeftName="getSubFeatureIcon(row.sub_feature)"
            :pContent="row.sub_feature"
          />
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-user-column"
        pLabel="Utilisateur"
        pProp="user.email"
        pSortable="custom"
        pMinWidth="120px"
      >
        <template #default="{ row }">
          <div class="flex flex--direction-column">
            <span
              v-if="hasUserFullName(row.user) === true"
              class="font-medium"
            >
              {{ getUserFullName(row.user) }}
            </span>
            <span
              :class="hasUserFullName(row.user) === true
                ? 'font-small text-color--neutral-gray-500'
                : 'font-medium'"
            >
              {{ row.user.email }}
            </span>
          </div>
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-date-column"
        pLabel="Date et heure"
        pProp="date"
        pSortable="custom"
      >
        <template #default="{ row }">
          <span>{{ formatDateTime(row.date) }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-evaluation-column"
        pLabel="Évaluation"
        pProp="evaluation"
        pSortable="custom"
        pAlign="center"
      >
        <template #default="{ row }">
          <PIcon
            v-if="row.evaluation !== null"
            :pName="getEvaluationIcon(row.evaluation)"
            :color="getEvaluationColor(row.evaluation)"
            pSize="18"
          />
          <span
            v-else
            class="text-color--neutral-gray-400"
          >
            -
          </span>
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-cost-column"
        pLabel="Coût"
        pProp="cost"
        pSortable="custom"
      >
        <template #default="{ row }">
          <span>{{ formatCost(row.cost) }}</span>
        </template>
      </PTableColumn>

      <PTableColumn
        data-testid="ai-monitoring-table-time-column"
        pLabel="Temps (s)"
        pProp="time"
        pSortable="custom"
        pWidth="120px"
      >
        <template #default="{ row }">
          <span>{{ formatDurationInSeconds(row.time) }}</span>
        </template>
      </PTableColumn>
    </PTable>

    <div
      v-else
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
        flex-gap--4
        padding--16
      "
    >
      <PIcon
        pName="clipboardData"
        pSize="48"
        color="var(--el-text-color-placeholder)"
      />
      <p class="text-color--neutral-gray-500 font-small text-center">
        Aucun historique de recherche IA disponible
      </p>
    </div>

    <PPagination
      v-if="props.history.length > 0"
      data-testid="ai-monitoring-table-pagination"
      class="margin-top--8"
      :pCurrentPage="props.currentPage"
      :pPageSize="props.pageSize"
      :pTotal="props.totalItems"
      :pPageSizes="[10, 25, 50, 100]"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      @on-page-range-changed="handlePageSizeChange"
      @update:p-current-page="handlePageChange"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PTable, PTableColumn, PIcon, PTag, PPagination, PLoader } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { getPaginationLabel } from '@pulse/common/utils'
import { formatDateTime } from '@pulse/toolbox/utils/dates'
import type { AiMonitoringTableProps } from './ai-monitoring-table.type'
import type { AiSearchHistoryItem } from '../../../types/ai-monitoring.type'
import {
  formatCost,
  formatDurationInSeconds,
  getEvaluationColor,
  getEvaluationIcon,
  getSubFeatureColor,
  getSubFeatureIcon,
  getUserFullName,
  hasUserFullName,
} from './ai-monitoring-table.utils'

const props = defineProps<AiMonitoringTableProps>()

const getRowKey = (row: AiSearchHistoryItem) => {
  return `${row.date}-${row.user.email}-${row.feature}`
}

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}>()

const paginationLabel = computed(() =>
  getPaginationLabel('sur', {
    currentPage: props.currentPage,
    limit: props.pageSize,
    data: props.history,
    totalItems: props.totalItems,
  }),
)

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handlePageSizeChange = (pageSize: number) => {
  emit('page-size-change', pageSize)
}
</script>

<style lang="scss" scoped>
.ai-monitoring-table__loader {
  min-height: 400px;
}

.ai-monitoring-table__section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.5px;
}

.ai-monitoring-table__question-text {
  margin: 0;
  font-style: italic;
}

.ai-monitoring-table__response-text {
  margin: 0;
  line-height: 1.5;
}
</style>
