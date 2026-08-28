<template>
  <div class="commit-explorer-tab">
    <div
      v-if="repoExplorers.length === 0"
      class="commit-explorer-tab__empty text-center padding--6"
    >
      <p class="text-color--neutral-gray-500">
        Aucun repository sélectionné.
      </p>
    </div>

    <PCollapse
      v-else
      v-model="activeRepositories"
    >
      <PCollapseItem
        v-for="entry in repoExplorers"
        :key="entry.repository"
        pType="default"
        pIconName="circleCheckDuotone"
        :name="entry.repository"
        :pTitleCollapseItem="getRepoTitle(entry)"
        pFullBody
        data-testid="commit-explorer-tab-repo-section"
      >
        <template
          v-if="entry.explorer.isLoading.value && entry.explorer.commits.value.length === 0"
          #before-title
        >
          <PLoader
            pSize="small"
            class="margin-right--2"
          />
        </template>

        <PAlert
          v-if="entry.explorer.warnings.value.length > 0"
          pType="warning"
          class="margin-bottom--4"
        >
          <ul class="margin--0 padding-left--4">
            <li
              v-for="(warning, index) in entry.explorer.warnings.value"
              :key="index"
            >
              {{ warning }}
            </li>
          </ul>
        </PAlert>

        <CommitExplorerList
          :commits="entry.explorer.commits.value"
          :isLoading="entry.explorer.isLoading.value"
          :isLoadingMore="entry.explorer.isLoadingMore.value"
          :error="entry.explorer.error.value"
          :hasMore="entry.explorer.hasMore.value"
          :repository="entry.repository"
          @load-more="entry.explorer.loadMore"
        />
      </PCollapseItem>
    </PCollapse>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { PCollapse, PCollapseItem, PAlert, PLoader } from '@pulse/styleguide/components'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { useCommitExplorer } from './use-commit-explorer.composable'
import { syncRepoExplorers } from './commit-explorer-tab.helper'
import CommitExplorerList from './commit-explorer-list.vue'
import type { RepoExplorerEntry } from './commit-explorer-tab.types'

type RepoExplorer = RepoExplorerEntry<ReturnType<typeof useCommitExplorer>>

// While a repository's first page of commits is still loading, show a loader instead of a
// misleading "(0)" count in the section title.
const getRepoTitle = (entry: RepoExplorer): string => {
  if (entry.explorer.isLoading.value && entry.explorer.commits.value.length === 0) {
    return entry.repository
  }
  return `${entry.repository} (${entry.explorer.commits.value.length})`
}

const azureDevOpsStore = useAzureDevOpsStore()

const activeRepositories = ref<string[]>([])
// shallowRef: each entry's composable properties (commits, isLoading, ...) are already Refs.
// A deep ref() would wrap them in a reactive proxy, which auto-unwraps nested Refs on access
// and breaks explicit ".value" reads in the template/script below.
const repoExplorers = shallowRef<RepoExplorer[]>([])

// Keep one explorer instance per selected repository, loading commits for any newly added one.
// Repositories are loaded sequentially to avoid overwhelming the Azure DevOps API.
watch(
  () => azureDevOpsStore.getEffectiveRepositories,
  async (effectiveRepositories) => {
    repoExplorers.value = syncRepoExplorers(
      effectiveRepositories,
      repoExplorers.value,
      (repository) => useCommitExplorer(() => repository),
    )

    // Drop expanded-panel names that no longer have a matching repository, otherwise PCollapse
    // tries to patch a panel whose PCollapseItem vnode is gone.
    const stillAvailableRepositories = new Set(repoExplorers.value.map((entry) => entry.repository))
    activeRepositories.value = activeRepositories.value.filter((name) => stillAvailableRepositories.has(name))

    for (const entry of repoExplorers.value) {
      if (entry.explorer.commits.value.length === 0 && entry.explorer.isLoading.value === false) {
        await entry.explorer.load()
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.commit-explorer-tab {
  &__empty {
    background-color: var(--el-fill-color-lighter);
    border-radius: 8px;
  }
}
</style>
