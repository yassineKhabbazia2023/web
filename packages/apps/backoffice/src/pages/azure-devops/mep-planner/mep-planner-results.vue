<template>
  <div class="mep-planner-results">
    <div
      v-if="isLoading === true"
      class="
        mep-planner-results__loader
        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
      "
    >
      <PLoader
        pType="no-color"
        pSize="40"
      />
      <p
        class="
          text-color--neutral-gray-500
          font-small
          margin-top--4
        "
      >
        {{ loadingProgress.step }}
      </p>
      <progress
        v-if="loadingProgress.total > 0"
        :value="loadingProgress.current"
        :max="loadingProgress.total"
        class="mep-planner-results__progress margin-top--2"
      />
      <p
        v-if="loadingProgress.total > 0"
        class="
          text-color--neutral-gray-400
          font-small
          margin-top--1
        "
      >
        {{ loadingProgress.current }}/{{ loadingProgress.total }}
      </p>
    </div>

    <PAlert
      v-else-if="error !== null"
      pType="error"
      class="margin-bottom--4"
    >
      {{ error }}
    </PAlert>

    <template v-else-if="hasResults === true">
      <PAlert
        v-if="warnings.length > 0"
        pType="warning"
        class="margin-bottom--4"
      >
        <ul class="margin--0 padding-left--4">
          <li
            v-for="(warning, index) in warnings"
            :key="index"
          >
            {{ warning }}
          </li>
        </ul>
      </PAlert>

      <div
        class="
          flex
          flex--align-items-center
          flex-gap--2
          margin-bottom--4
        "
      >
        <PTag
          pColor="info"
          :pContent="summaryLabel"
        />
        <PButton
          v-if="ticketsResult !== null && hasReposWithTarget === true"
          pType="secondary"
          pSize="small"
          :pLoading="isCheckingReadiness"
          @click="emit('checkReadiness')"
        >
          Vérifier si la MEP est prête
        </PButton>
      </div>

      <template v-if="mepReadiness !== null">
        <MepPlannerReadinessStatus :mepReadiness="mepReadiness" />
        <MepPlannerRecetteChecks :recetteChecks="mepReadiness.recetteChecks" />
      </template>

      <template v-if="ticketsResult !== null">
        <PCollapse v-model="activeItems">
          <PCollapseItem
            v-for="analysis in ticketsResult.repoAnalyses"
            :key="analysis.repositoryName"
            pType="gray"
            pIconName="folder"
            :name="analysis.repositoryName"
            :pTitleCollapseItem="getRepoTitle(analysis)"
            pFullBody
          >
            <template #before-title>
              <PIcon
                v-if="hasIncompleteWorkItems(analysis.workItemsInRange) === true"
                pName="exclamationTriangle"
                pSize="16"
                class="
                  text-color--danger-500
                  margin-right--2
                "
              />
            </template>

            <div class="padding--4">
              <div
                class="
                  flex
                  flex-gap--3
                  margin-bottom--4
                "
              >
                <PTag
                  v-if="analysis.latestMepTag !== null"
                  pColor="info"
                  pSize="small"
                  :pContent="`En prod: ${analysis.latestMepTag.name}`"
                />
                <PTag
                  :pColor="isAlreadyDeployed(analysis) === true ? 'info' : 'success'"
                  pSize="small"
                  :pContent="isAlreadyDeployed(analysis) === true
                    ? getTargetLabel(analysis)
                    : `Cible: ${getTargetLabel(analysis)}`"
                />
              </div>

              <h4
                class="
                  font-small
                  font-bold
                  margin-bottom--2
                "
              >
                PRs liées
              </h4>
              <PTable
                :pData="getLinkedPrsForRepo(ticketsResult, analysis)"
                pSize="small"
                class="margin-bottom--4"
              >
                <PTableColumn
                  pProp="pullRequestId"
                  pLabel="ID"
                  pWidth="80"
                >
                  <template #default="{ row }">
                    <span class="font-bold">{{ row.pullRequestId }}</span>
                  </template>
                </PTableColumn>

                <PTableColumn
                  pProp="title"
                  pLabel="Titre"
                  pMinWidth="250"
                />

                <PTableColumn
                  pProp="sourceBranch"
                  pLabel="Branche"
                  pWidth="200"
                />

                <PTableColumn
                  pLabel="Statut"
                  pWidth="120"
                >
                  <template #default="{ row }">
                    <PTag
                      :pColor="getPrStatusColor(analysis.prStatuses[row.pullRequestId])"
                      :pContent="getPrStatusLabel(analysis.prStatuses[row.pullRequestId])"
                      pSize="small"
                    />
                  </template>
                </PTableColumn>
              </PTable>

              <template v-if="analysis.workItemsInRange.length > 0">
                <h4
                  class="
                    font-small
                    font-bold
                    margin-bottom--2
                  "
                >
                  Work Items ({{ analysis.workItemsInRange.length }})
                </h4>
                <WorkItemsTable :workItems="analysis.workItemsInRange" />
              </template>
            </div>
          </PCollapseItem>
        </PCollapse>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PAlert,
  PButton,
  PCollapse,
  PCollapseItem,
  PIcon,
  PLoader,
  PTable,
  PTableColumn,
  PTag,
} from '@pulse/styleguide/components'
import WorkItemsTable from './mep-planner-work-items-table.vue'
import MepPlannerReadinessStatus from './mep-planner-readiness-status.vue'
import MepPlannerRecetteChecks from './mep-planner-recette-checks.vue'
import type {
  MepPlannerLoadingProgress,
  MepPlannerTicketsResult,
  MepReadinessResult,
} from './mep-planner.type'
import {
  getLinkedPrsForRepo,
  getPrStatusColor,
  getPrStatusLabel,
  getRepoTitle,
  getTargetLabel,
  hasIncompleteWorkItems,
  isAlreadyDeployed,
} from './mep-planner-results.helper'

const props = defineProps<{
  ticketsResult: MepPlannerTicketsResult | null
  isLoading: boolean
  error: string | null
  warnings: string[]
  loadingProgress: MepPlannerLoadingProgress
  mepReadiness: MepReadinessResult | null
  isCheckingReadiness: boolean
}>()

const emit = defineEmits<{
  checkReadiness: []
}>()

const activeItems = ref<string[]>([])

const hasReposWithTarget = computed(() => {
  if (props.ticketsResult === null) {
    return false
  }
  return props.ticketsResult.repoAnalyses.some((a) => a.headCommitId !== '')
})

const hasResults = computed(() => {
  if (props.ticketsResult === null) {
    return false
  }
  return props.ticketsResult.repoAnalyses.length > 0 || props.ticketsResult.warnings.length > 0
})

const summaryLabel = computed(() => {
  if (props.ticketsResult === null) {
    return ''
  }
  const repoCount = props.ticketsResult.repoAnalyses.length
  return `${repoCount} repository${repoCount > 1 ? 's' : ''} impacté${repoCount > 1 ? 's' : ''}`
})
</script>

<style scoped lang="scss">
.mep-planner-results {
  &__loader {
    min-height: 200px;
  }

  &__progress {
    width: 200px;
    height: 6px;
    appearance: none;
    border: none;
    border-radius: 3px;
    overflow: hidden;

    &::-webkit-progress-bar {
      background-color: var(--el-fill-color-light);
      border-radius: 3px;
    }

    &::-webkit-progress-value {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }
  }
}
</style>
