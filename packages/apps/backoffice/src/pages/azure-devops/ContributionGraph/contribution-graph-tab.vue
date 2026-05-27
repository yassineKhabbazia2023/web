<template>
  <div class="padding-top--4">
    <PAlert
      v-if="error !== null"
      pType="error"
      class="margin-top--4"
    >
      {{ error }}
    </PAlert>

    <div
      v-if="isLoading"
      class="margin-top--4"
    >
      <p class="text-color--neutral-gray-500 font-small">
        Analyse de {{ loadingProgress.loaded }}/{{ loadingProgress.total }} repositories...
      </p>
      <progress
        :value="progressPercentage"
        max="100"
        class="contribution-graph-tab__progress margin-top--2"
      />
    </div>

    <div
      v-if="isLoading === false && error === null && currentUserDisplayName !== null"
      class="margin-top--2"
    >
      <h3
        class="
          font-medium
          font-bold
          margin-bottom--4
        "
      >
        Contributions de {{ currentUserDisplayName }}
      </h3>

      <div
        class="
          flex
          flex--align-items-center
          flex-gap--4
          margin-bottom--4
        "
      >
        <div class="contribution-graph-tab__filter">
          <PCheckbox v-model="showCommits">
            Commits ({{ commitsCount }})
          </PCheckbox>
        </div>
        <div class="contribution-graph-tab__filter contribution-graph-tab__color--workitem">
          <PCheckbox v-model="showWorkItems">
            Work Items ({{ workItemsCount }})
          </PCheckbox>
        </div>
        <div class="contribution-graph-tab__filter contribution-graph-tab__color--prreview">
          <PCheckbox v-model="showPrReviews">
            PR Reviews ({{ prReviewsCount }})
          </PCheckbox>
        </div>
      </div>

      <ContributionHeatmap
        :contributionsByDate="contributionsByDate"
        :startDate="startDate"
        :endDate="endDate"
        :selectedDate="selectedDate"
        @select-date="handleSelectDate"
      />

      <div
        v-if="hasContributions === false && selectedDate === null"
        class="margin-top--4"
      >
        <p class="text-color--neutral-gray-500">
          Aucune contribution trouvée sur les 3 derniers mois.
        </p>
      </div>

      <div
        v-if="recentActivity.length > 0 || selectedDate !== null"
        class="margin-top--6"
      >
        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
            margin-bottom--3
          "
        >
          <h4
            v-if="selectedDate === null"
            class="font-small font-bold"
          >
            Activité récente
          </h4>
          <template v-else>
            <h4 class="font-small font-bold">
              Activité du {{ formattedSelectedDate }}
            </h4>
            <span class="contribution-graph-tab__date-count">
              {{ recentActivityTotal }}
            </span>
            <button
              class="contribution-graph-tab__clear-link font-small"
              @click="clearSelectedDate"
            >
              Voir tout
            </button>
          </template>
        </div>

        <p
          v-if="recentActivity.length === 0 && selectedDate !== null"
          class="text-color--neutral-gray-500 font-small"
        >
          Aucune activité ce jour.
        </p>
        <div class="contribution-graph-tab__activity-list">
          <div
            v-for="(item, index) in recentActivity"
            :key="`${item.kind}-${index}`"
            :class="[
              'contribution-graph-tab__activity-item',
              item.kind === 'workitem' ? 'contribution-graph-tab__color--workitem' : '',
              item.kind === 'prreview' ? 'contribution-graph-tab__color--prreview' : '',
            ]"
          >
            <template v-if="item.kind === 'commit'">
              <div class="flex flex--align-items-center flex-gap--2">
                <code class="contribution-graph-tab__commit-id">{{ item.shortCommitId }}</code>
                <span class="contribution-graph-tab__repo-badge">{{ item.repositoryName }}</span>
                <span class="contribution-graph-tab__reason-badge--created">Commit</span>
              </div>
              <p class="contribution-graph-tab__commit-comment">
                {{ item.firstLine }}
              </p>
            </template>
            <template v-else-if="item.kind === 'prreview'">
              <div class="flex flex--align-items-center flex-gap--2">
                <span class="contribution-graph-tab__prreview-badge">PR Review</span>
                <a
                  :href="item.webUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contribution-graph-tab__workitem-link"
                >
                  #{{ item.pullRequestId }}
                </a>
                <span class="contribution-graph-tab__repo-badge">{{ item.repositoryName }}</span>
                <span class="text-color--neutral-gray-400 font-small">
                  par {{ item.author }}
                </span>
              </div>
              <p class="contribution-graph-tab__commit-comment">
                {{ item.title }}
              </p>
            </template>
            <template v-else>
              <div class="flex flex--align-items-center flex-gap--2">
                <span class="contribution-graph-tab__workitem-badge">{{ item.workItemType }}</span>
                <a
                  :href="item.webUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contribution-graph-tab__workitem-link"
                >
                  #{{ item.workItemId }}
                </a>
                <span class="contribution-graph-tab__workitem-state">{{ item.state }}</span>
                <span :class="'contribution-graph-tab__reason-badge--' + item.reason">
                  {{ { created: 'Créé', resolved: 'Résolu', activated: 'Activé' }[item.reason] }}
                </span>
              </div>
              <p class="contribution-graph-tab__commit-comment">
                {{ item.title }}
              </p>
            </template>
            <span class="text-color--neutral-gray-400 font-small">
              {{ item.formattedDate }}
            </span>
          </div>
        </div>
        <div
          v-if="hasMoreActivity"
          class="contribution-graph-tab__load-more"
        >
          <PButton
            pType="tertiary"
            pSize="small"
            @click="loadMoreActivity"
          >
            Charger plus d'activité
          </PButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAlert, PButton, PCheckbox } from '@pulse/styleguide/components'
import ContributionHeatmap from './contribution-heatmap.vue'
import { useContributionGraph } from './use-contribution-graph.composable'

const {
  contributionsByDate,
  recentActivity,
  hasMoreActivity,
  isLoading,
  loadingProgress,
  error,
  startDate,
  endDate,
  hasContributions,
  currentUserDisplayName,
  showCommits,
  showWorkItems,
  showPrReviews,
  commitsCount,
  workItemsCount,
  prReviewsCount,
  selectedDate,
  formattedSelectedDate,
  recentActivityTotal,
  load,
  loadMoreActivity,
  selectDate,
  clearSelectedDate,
} = useContributionGraph()

const handleSelectDate = (dateKey: string): void => {
  selectDate(dateKey)
}

const progressPercentage = computed(() => {
  if (loadingProgress.value.total === 0) {
    return 0
  }
  return Math.round((loadingProgress.value.loaded / loadingProgress.value.total) * 100)
})

load()
</script>

<style scoped>
.contribution-graph-tab__activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contribution-graph-tab__activity-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 6px;
}

.contribution-graph-tab__filter {
  padding: 4px 10px;
  border-radius: 6px;
}

.contribution-graph-tab__color--workitem {
  background-color: var(--p-black-rock-50);
}

.contribution-graph-tab__color--prreview {
  background-color: var(--el-color-danger-light-9, #fef0f0);
}

.contribution-graph-tab__prreview-badge {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-danger-light-8, #fab6b6);
  color: var(--el-color-danger, #f56c6c);
  border-radius: 4px;
}

.contribution-graph-tab__commit-id {
  font-size: 12px;
  padding: 2px 6px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
  font-family: monospace;
}

.contribution-graph-tab__repo-badge {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--el-color-primary, #409eff);
  border-radius: 4px;
}

.contribution-graph-tab__workitem-badge {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-success-light-9, #f0f9eb);
  color: var(--el-color-success, #67c23a);
  border-radius: 4px;
}

.contribution-graph-tab__workitem-link {
  font-size: 12px;
  font-family: monospace;
  color: var(--el-color-primary, #409eff);
  text-decoration: none;
}

.contribution-graph-tab__workitem-link:hover {
  text-decoration: underline;
}

.contribution-graph-tab__workitem-state {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  color: var(--el-text-color-secondary, #909399);
  border-radius: 4px;
}

.contribution-graph-tab__reason-badge--created {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--el-color-primary, #409eff);
  border-radius: 4px;
}

.contribution-graph-tab__reason-badge--resolved {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-warning-light-9, #fdf6ec);
  color: var(--el-color-warning, #e6a23c);
  border-radius: 4px;
}

.contribution-graph-tab__reason-badge--activated {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-color-success-light-9, #f0f9eb);
  color: var(--el-color-success, #67c23a);
  border-radius: 4px;
}

.contribution-graph-tab__date-count {
  font-size: 11px;
  padding: 1px 6px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  color: var(--el-text-color-secondary, #909399);
  border-radius: 10px;
}

.contribution-graph-tab__clear-link {
  color: var(--el-color-primary, #409eff);
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}

.contribution-graph-tab__clear-link:hover {
  text-decoration: underline;
}

.contribution-graph-tab__load-more {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.contribution-graph-tab__commit-comment {
  margin: 4px 0;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contribution-graph-tab__progress {
  width: 100%;
  height: 8px;
  appearance: none;
  border: none;
  border-radius: 4px;
  overflow: hidden;
}

.contribution-graph-tab__progress::-webkit-progress-bar {
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
}

.contribution-graph-tab__progress::-webkit-progress-value {
  background-color: var(--el-color-primary, #409eff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.contribution-graph-tab__progress::-moz-progress-bar {
  background-color: var(--el-color-primary, #409eff);
  border-radius: 4px;
}
</style>
