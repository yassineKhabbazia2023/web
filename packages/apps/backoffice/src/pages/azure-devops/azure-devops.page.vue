<template>
  <div class="azure-devops-page">
    <div class="padding-y--2 padding-x--6 padding-bottom--0">
      <h1
        class="font-large font-bold text-color--black-rock-900"
        data-testid="azure-devops-page-title"
      >
        Azure DevOps
      </h1>
      <p class="text-color--neutral-gray-500 font-small">
        Configurez votre accès Azure DevOps
      </p>
    </div>

    <div class="padding-x--6 padding-top--6">
      <div class="azure-devops-page__pat-section">
        <PForm pLabelPosition="top">
          <PFormItem pLabelFor="pat-input">
            <template #label>
              <div class="flex flex--align-items-center">
                <span>Personal Access Token (PAT)</span>
                <PTooltip
                  pPlacement="right"
                  :pContent="patTooltipContent"
                >
                  <PIcon
                    pName="questionCircle"
                    pSize="14"
                    class="margin-left--1 cursor--pointer"
                  />
                </PTooltip>
              </div>
            </template>
            <div class="flex flex-gap--2 flex--align-items-center">
              <div
                class="azure-devops-page__pat-input"
                data-testid="azure-devops-pat-input"
              >
                <PInput
                  id="pat-input"
                  v-model="patValue"
                  pPlaceholder="Entrez votre PAT Azure DevOps"
                  pType="password"
                />
              </div>
              <PButton
                pType="secondary"
                pSize="default"
                :pLoading="isTestingPat"
                :pDisabled="azureDevOpsStore.hasPat === false"
                data-testid="test-pat-button"
                @click="testPat"
              >
                Tester
              </PButton>
            </div>
          </PFormItem>
        </PForm>
        <p class="text-color--neutral-gray-400 font-small margin-top--2">
          Le PAT est stocké uniquement en mémoire et sera perdu lors du rafraîchissement de la page.
        </p>
        <PAlert
          v-if="patTestResult !== null"
          :pType="patTestResult.success ? 'success' : 'error'"
          class="margin-top--3"
        >
          {{ patTestResult.message }}
        </PAlert>
      </div>
    </div>

    <div
      v-if="isPatValidated"
      class="padding-x--6 padding-top--6"
    >
      <PForm pLabelPosition="top">
        <PFormItem pLabel="Repository">
          <div class="azure-devops-page__repo-select">
            <PDropdown
              v-model="selectedRepository"
              data-testid="azure-devops-repo-select"
              pPlaceholder="Sélectionnez un repository"
              :pLoading="azureDevOpsStore.isLoadingRepositories"
              :pDisabled="azureDevOpsStore.hasRepositories === false"
              :pOptions="repositoryOptions"
              pFilterable
            />
          </div>
        </PFormItem>
      </PForm>

      <PTabs
        v-model="activeTab"
        class="margin-top--4"
      >
        <PTabPane
          pLabel="MEP Standard"
          pName="mep-standard"
        >
          <div class="padding-top--4">
            <WorkItemsSearch
              v-model:fromCommitId="fromCommitId"
              v-model:toCommitId="toCommitId"
              v-model:backofficeOnly="backofficeOnly"
              :isLoading="isLoading"
              :canSearch="canSearch"
              :latestMepTag="latestMepTag"
              :isLoadingMepTag="isLoadingMepTag"
              :headInfo="headInfo"
              :isLoadingHead="isLoadingHead"
              :fromCommitIdError="fromCommitIdError"
              :toCommitIdError="toCommitIdError"
              @search="fetchWorkItems"
              @apply-mep-tag="applyMepTagToFromCommit"
              @apply-head="applyHeadToToCommit"
              @open-explorer="openExplorer"
              @update:backoffice-only="fetchLatestMepTag"
            />

            <WorkItemsResults
              v-if="shouldDisplayWorkItemsResults"
              :workItemsByTeam="workItemsByTeam"
              :sortedTeamNames="sortedTeamNames"
              :totalWorkItems="totalWorkItems"
              :isLoading="isLoading"
              :error="error"
              :failedWorkItemIds="failedWorkItemIds"
              :warnings="warnings"
              :hasResults="hasResults"
              :hasPartialErrors="hasPartialErrors"
              :hasWarnings="hasWarnings"
              :repositoryName="selectedRepository"
              class="margin-top--6"
            />
          </div>
        </PTabPane>

        <PTabPane
          pLabel="Explorateur de commits"
          pName="commit-explorer"
        >
          <div class="padding-top--4">
            <CommitExplorerList
              :commits="explorerCommits"
              :isLoading="isExplorerLoading"
              :isLoadingMore="isExplorerLoadingMore"
              :error="explorerError"
              :hasMore="explorerHasMore"
              :repository="selectedRepository"
              @load-more="loadMoreExplorer"
            />
          </div>
        </PTabPane>

        <PTabPane
          pLabel="Contribution Graph"
          pName="contribution-graph"
          pLazy
        >
          <ContributionGraphTab />
        </PTabPane>
      </PTabs>
    </div>

    <CommitExplorerModal
      v-model="isExplorerOpen"
      :repository="selectedRepository"
      @commit-selected="handleCommitSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PInput,
  PForm,
  PFormItem,
  PButton,
  PAlert,
  PIcon,
  PTooltip,
  PDropdown,
  PTabs,
  PTabPane,
} from '@pulse/styleguide/components'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { useAzureDevOpsWorkItems } from '@backoffice/composables/use-azure-devops-work-items.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import WorkItemsSearch from './WorkItemsSearch/work-items-search.vue'
import WorkItemsResults from './WorkItemsResults/work-items-results.vue'
import CommitExplorerModal from './CommitExplorerModal/commit-explorer-modal.vue'
import CommitExplorerList from './CommitExplorer/commit-explorer-list.vue'
import { useCommitExplorer } from './CommitExplorer/use-commit-explorer.composable'
import ContributionGraphTab from './ContributionGraph/contribution-graph-tab.vue'

const azureDevOpsStore = useAzureDevOpsStore()

const selectedRepository = computed({
  get: () => azureDevOpsStore.selectedRepository,
  set: (value: string) => azureDevOpsStore.setSelectedRepository(value),
})

const repositoryOptions = computed(() => {
  return azureDevOpsStore.repositories.map((repo) => ({
    pValue: repo.name,
    pLabel: repo.name,
  }))
})

const patTooltipContent = `Comment créer un PAT :
1. Allez dans Azure DevOps → User Settings (icône engrenage)
2. Cliquez sur "Personal access tokens"
3. Cliquez sur "New Token"
4. Sélectionnez les droits :
   • Code : Read
   • Work Items : Read`

const patValue = computed({
  get: () => azureDevOpsStore.pat,
  set: (value: string) => azureDevOpsStore.setPat(value),
})

const isTestingPat = ref(false)
const patTestResult = ref<{ success: boolean; message: string } | null>(null)
const isPatValidated = ref(false)

const activeTab = ref('mep-standard')
const isExplorerOpen = ref(false)
const explorerTargetField = ref<'from' | 'to'>('from')

const {
  commits: explorerCommits,
  isLoading: isExplorerLoading,
  isLoadingMore: isExplorerLoadingMore,
  error: explorerError,
  hasMore: explorerHasMore,
  load: loadExplorer,
  loadMore: loadMoreExplorer,
  reset: resetExplorer,
} = useCommitExplorer()

// Reset validation when PAT changes
watch(
  () => azureDevOpsStore.pat,
  () => {
    isPatValidated.value = false
    patTestResult.value = null
  },
)

// Load explorer when tab changes to commit-explorer
watch(activeTab, (newTab) => {
  if (newTab === 'commit-explorer' && explorerCommits.value.length === 0) {
    loadExplorer()
  }
})

// Reload explorer when repository changes
watch(selectedRepository, () => {
  resetExplorer()
  if (activeTab.value === 'commit-explorer') {
    loadExplorer()
  }
})

const testPat = async () => {
  isTestingPat.value = true
  patTestResult.value = null

  try {
    // Wait for repositories to be loaded by the composable if still loading
    if (azureDevOpsStore.isLoadingRepositories) {
      await new Promise<void>((resolve) => {
        const unwatch = watch(
          () => azureDevOpsStore.isLoadingRepositories,
          (loading) => {
            if (loading === false) {
              unwatch()
              resolve()
            }
          },
          { immediate: true },
        )
      })
    }

    // Use already loaded repositories or fetch if needed
    const repositories = azureDevOpsStore.hasRepositories
      ? azureDevOpsStore.repositories
      : await AzureDevOpsService.getRepositories(azureDevOpsStore.pat)

    if (azureDevOpsStore.hasRepositories === false) {
      azureDevOpsStore.setRepositories(repositories)
    }

    patTestResult.value = {
      success: true,
      message: `PAT valide ! ${repositories.length} repositories trouvés.`,
    }
    isPatValidated.value = true
  } catch (err) {
    const error = err as Error
    patTestResult.value = {
      success: false,
      message: `Erreur : ${error.message || 'Impossible de valider le PAT'}`,
    }
    isPatValidated.value = false
  } finally {
    isTestingPat.value = false
  }
}

const openExplorer = (target: 'from' | 'to'): void => {
  explorerTargetField.value = target
  isExplorerOpen.value = true
}

const handleCommitSelected = (commitId: string): void => {
  if (explorerTargetField.value === 'from') {
    fromCommitId.value = commitId
  } else {
    toCommitId.value = commitId
  }
}

const {
  fromCommitId,
  toCommitId,
  backofficeOnly,
  workItemsByTeam,
  failedWorkItemIds,
  warnings,
  isLoading,
  error,
  hasResults,
  totalWorkItems,
  sortedTeamNames,
  canSearch,
  hasPartialErrors,
  hasWarnings,
  fromCommitIdError,
  toCommitIdError,
  latestMepTag,
  isLoadingMepTag,
  headInfo,
  isLoadingHead,
  fetchWorkItems,
  fetchLatestMepTag,
  applyMepTagToFromCommit,
  applyHeadToToCommit,
} = useAzureDevOpsWorkItems()

const shouldDisplayWorkItemsResults = computed(
  () => hasResults.value || isLoading.value || error.value !== null || hasWarnings.value,
)
</script>

<style scoped>
.azure-devops-page__pat-input {
  width: min(500px, 75vw);
}

.azure-devops-page__repo-select {
  width: min(400px, 60vw);
}
</style>
