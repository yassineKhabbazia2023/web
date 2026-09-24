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
      v-if="isLoading === true"
      class="margin-top--4"
    >
      <p class="text-color--neutral-gray-500 font-small">
        Analyse de {{ loadingProgress.loaded }}/{{ loadingProgress.total }} repositories...
      </p>
      <progress
        :value="progressPercentage"
        max="100"
        class="pr-completion-time-tab__progress margin-top--2"
      />
    </div>

    <div class="margin-top--4">
      <div class="flex flex--align-items-end flex-gap--4">
        <div class="pr-completion-time-tab__field">
          <label
            class="
              pr-completion-time-tab__label
              font-small
              font-semibold
              text-color--neutral-gray-500
              margin-bottom--2
            "
          >
            Période
          </label>
          <PDatePicker
            v-model="dateRange"
            data-testid="pr-completion-time-date-range"
            pType="monthrange"
            pRangeSeparator="-"
            pStartPlaceholder="Mois de début"
            pEndPlaceholder="Mois de fin"
            :pFormat="DATE_FORMAT.FR"
            pClearable
            :pDisabled="isLoading"
          />
        </div>

        <PButton
          data-testid="pr-completion-time-search-button"
          pType="primary"
          :pLoading="isLoading"
          :pDisabled="isLoading"
          @click="load"
        >
          Rechercher
        </PButton>
      </div>

      <div
        class="
          flex
          flex--align-items-center
          flex-gap--4
          margin-top--3
        "
      >
        <!-- No @change needed: myPrsOnly is a client-side filter via displayedPrItems computed -->
        <PCheckbox
          v-model="myPrsOnly"
          data-testid="pr-completion-time-my-prs"
          :disabled="isLoading || canFilterMyPrs === false"
        >
          Mes PRs uniquement
        </PCheckbox>
        <!-- @change triggers re-fetch because active/completed filter is server-side -->
        <PCheckbox
          v-model="includeActivePrs"
          data-testid="pr-completion-time-include-active"
          :disabled="isLoading"
          @update:model-value="load"
        >
          Inclure les PRs en cours (non-draft)
        </PCheckbox>
      </div>
    </div>

    <div
      v-if="isLoading === false && error === null && displayedPrItems.length > 0"
      class="margin-top--6"
    >
      <div
        class="
          flex
          flex--wrap
          flex-gap--3
          margin-bottom--4
        "
      >
        <div class="pr-completion-time-tab__stat pr-completion-time-tab__stat--global">
          <span class="font-small text-color--neutral-gray-500">Temps moyen global</span>
          <span class="font-large font-bold">{{ overallAverageFormatted }}</span>
        </div>
        <div class="pr-completion-time-tab__stat pr-completion-time-tab__stat--global">
          <div class="flex flex--align-items-center">
            <span class="font-small text-color--neutral-gray-500">PRs complétées</span>
            <PTooltip
              pPlacement="top"
              pContent="PRs envoyées vers la branche main et mergées"
            >
              <PIcon
                pName="questionCircle"
                pSize="14"
                class="margin-left--1 cursor--pointer"
              />
            </PTooltip>
          </div>
          <span class="font-large font-bold">{{ totalPrCount }}</span>
        </div>
        <div class="pr-completion-time-tab__stat pr-completion-time-tab__stat--front">
          <div class="flex flex--align-items-center">
            <span class="font-small font-semibold">Front</span>
            <PTooltip
              pPlacement="top"
              pContent="Repository Pulse.Web"
            >
              <PIcon
                pName="questionCircle"
                pSize="14"
                class="margin-left--1 cursor--pointer"
              />
            </PTooltip>
          </div>
          <div class="flex flex--align-items-center flex-gap--3">
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">Temps moyen</span>
              <span class="font-medium font-bold">{{ frontBackStats.front.averageFormatted }}</span>
            </div>
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">PRs</span>
              <span class="font-medium font-bold">{{ frontBackStats.front.prCount }}</span>
            </div>
          </div>
        </div>
        <div class="pr-completion-time-tab__stat pr-completion-time-tab__stat--back">
          <div class="flex flex--align-items-center">
            <span class="font-small font-semibold">Back</span>
            <PTooltip
              pPlacement="top"
              pContent="Tous les repositories sauf Pulse.Web"
            >
              <PIcon
                pName="questionCircle"
                pSize="14"
                class="margin-left--1 cursor--pointer"
              />
            </PTooltip>
          </div>
          <div class="flex flex--align-items-center flex-gap--3">
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">Temps moyen</span>
              <span class="font-medium font-bold">{{ frontBackStats.back.averageFormatted }}</span>
            </div>
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">PRs</span>
              <span class="font-medium font-bold">{{ frontBackStats.back.prCount }}</span>
            </div>
          </div>
        </div>
        <div
          v-for="repoStat in statsByRepository"
          :key="repoStat.repositoryName"
          class="pr-completion-time-tab__stat"
        >
          <span
            class="
              font-small
              font-semibold
              text-color--neutral-gray-700
            "
          >
            {{ repoStat.repositoryName }}
          </span>
          <div class="flex flex--align-items-center flex-gap--3">
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">Temps moyen</span>
              <span class="font-medium font-bold">{{ repoStat.averageFormatted }}</span>
            </div>
            <div class="flex flex--direction-column flex-gap--half">
              <span class="font-small text-color--neutral-gray-400">PRs</span>
              <span class="font-medium font-bold">{{ repoStat.prCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <PrCompletionTimeTable :items="displayedPrItems" />
    </div>

    <div
      v-if="isLoading === false && error === null && displayedPrItems.length === 0 && hasSearched === true"
      class="margin-top--6"
    >
      <p class="text-color--neutral-gray-500">
        Aucune PR complétée trouvée sur cette période.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PAlert, PButton, PCheckbox, PDatePicker, PIcon, PTooltip } from '@pulse/styleguide/components'
import { DATE_FORMAT } from '@pulse/toolbox'
import PrCompletionTimeTable from './pr-completion-time-table.vue'
import { usePrCompletionTime } from './use-pr-completion-time.composable'

const {
  displayedPrItems,
  isLoading,
  loadingProgress,
  error,
  dateRange,
  includeActivePrs,
  myPrsOnly,
  canFilterMyPrs,
  overallAverageFormatted,
  totalPrCount,
  statsByRepository,
  frontBackStats,
  load: loadData,
} = usePrCompletionTime()

const hasSearched = ref(false)

const progressPercentage = computed(() => {
  if (loadingProgress.value.total === 0) {
    return 0
  }
  return Math.round((loadingProgress.value.loaded / loadingProgress.value.total) * 100)
})

const load = async () => {
  hasSearched.value = true
  await loadData()
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.pr-completion-time-tab__progress {
  width: 100%;
  height: 8px;
  appearance: none;
  border: none;
  border-radius: 4px;
  overflow: hidden;
}

.pr-completion-time-tab__progress::-webkit-progress-bar {
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
}

.pr-completion-time-tab__progress::-webkit-progress-value {
  background-color: var(--el-color-primary, #409eff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pr-completion-time-tab__progress::-moz-progress-bar {
  background-color: var(--el-color-primary, #409eff);
  border-radius: 4px;
}

.pr-completion-time-tab__field {
  min-width: 200px;
}

.pr-completion-time-tab__field :deep(.el-date-editor) {
  width: 100%;
}

.pr-completion-time-tab__label {
  display: block;
}

.pr-completion-time-tab__stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 20px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 8px;
  min-width: 180px;
}

.pr-completion-time-tab__stat--global {
  background-color: var(--el-color-primary-light-9, #ecf5ff);
  border-color: var(--el-color-primary-light-7, #c6e2ff);
}

.pr-completion-time-tab__stat--front {
  background-color: var(--el-color-success-light-9, #f0f9eb);
  border-color: var(--el-color-success-light-5, #b3e19d);
}

.pr-completion-time-tab__stat--back {
  background-color: var(--el-color-warning-light-9, #fdf6ec);
  border-color: var(--el-color-warning-light-5, #f3d19e);
}

</style>
