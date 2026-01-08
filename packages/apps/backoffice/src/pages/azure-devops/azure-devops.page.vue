<template>
  <div class="azure-devops-page">
    <div class="padding-y--2 padding-x--6 padding-bottom--0">
      <h1 class="font-large font-bold text-color--black-rock-900">
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
              <div class="azure-devops-page__pat-input">
                <PInput
                  id="pat-input"
                  v-model="patValue"
                  data-testid="azure-devops-pat-input"
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
      v-if="azureDevOpsStore.hasPat"
      class="padding-x--6 padding-top--8"
    >
      <WorkItemsSearch
        v-model:fromCommitId="fromCommitId"
        v-model:toCommitId="toCommitId"
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
        class="margin-top--6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PInput, PForm, PFormItem, PButton, PAlert, PIcon, PTooltip } from '@pulse/styleguide/components'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { useAzureDevOpsWorkItems } from '@backoffice/composables/use-azure-devops-work-items.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import WorkItemsSearch from './WorkItemsSearch/work-items-search.vue'
import WorkItemsResults from './WorkItemsResults/work-items-results.vue'

const azureDevOpsStore = useAzureDevOpsStore()

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

const testPat = async () => {
  isTestingPat.value = true
  patTestResult.value = null

  try {
    const headCommitId = await AzureDevOpsService.getMainBranchHead(azureDevOpsStore.pat)
    patTestResult.value = {
      success: true,
      message: `PAT valide ! HEAD: ${headCommitId.substring(0, 8)}`,
    }
  } catch (err) {
    const error = err as Error
    patTestResult.value = {
      success: false,
      message: `Erreur : ${error.message || 'Impossible de valider le PAT'}`,
    }
  } finally {
    isTestingPat.value = false
  }
}

const {
  fromCommitId,
  toCommitId,
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
</style>
