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
      <h3 class="font-medium font-bold margin-bottom--4">
        Contributions de {{ currentUserDisplayName }}
      </h3>

      <ContributionHeatmap
        :contributionsByDate="contributionsByDate"
        :startDate="startDate"
        :endDate="endDate"
      />

      <div
        v-if="hasContributions === false"
        class="margin-top--4"
      >
        <p class="text-color--neutral-gray-500">
          Aucune contribution trouvée sur les 3 derniers mois.
        </p>
      </div>

      <div
        v-if="recentCommits.length > 0"
        class="margin-top--6"
      >
        <h4 class="font-small font-bold margin-bottom--3">
          Derniers commits
        </h4>
        <div class="contribution-graph-tab__commits-list">
          <div
            v-for="commit in recentCommits"
            :key="commit.commitId"
            class="contribution-graph-tab__commit-item"
          >
            <div class="flex flex--align-items-center flex-gap--2">
              <code class="contribution-graph-tab__commit-id">{{ commit.shortCommitId }}</code>
              <span class="contribution-graph-tab__repo-badge">{{ commit.repositoryName }}</span>
            </div>
            <p class="contribution-graph-tab__commit-comment">
              {{ commit.firstLine }}
            </p>
            <span class="text-color--neutral-gray-400 font-small">
              {{ commit.formattedDate }}
            </span>
          </div>
        </div>
        <div
          v-if="hasMoreCommits"
          class="contribution-graph-tab__load-more"
        >
          <PButton
            pType="tertiary"
            pSize="small"
            @click="loadMoreCommits"
          >
            Charger plus de commits
          </PButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PAlert, PButton } from '@pulse/styleguide/components'
import ContributionHeatmap from './contribution-heatmap.vue'
import { useContributionGraph } from './use-contribution-graph.composable'

const {
  contributionsByDate,
  recentCommits,
  hasMoreCommits,
  isLoading,
  loadingProgress,
  error,
  startDate,
  endDate,
  hasContributions,
  currentUserDisplayName,
  load,
  loadMoreCommits,
} = useContributionGraph()

const progressPercentage = computed(() => {
  if (loadingProgress.value.total === 0) {
    return 0
  }
  return Math.round((loadingProgress.value.loaded / loadingProgress.value.total) * 100)
})

onMounted(() => {
  load()
})
</script>

<style scoped>
.contribution-graph-tab__commits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contribution-graph-tab__commit-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 6px;
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
