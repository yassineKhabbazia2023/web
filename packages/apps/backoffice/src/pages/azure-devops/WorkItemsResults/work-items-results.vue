<template>
  <div class="work-items-results">
    <div
      v-if="isLoading"
      class="
        work-items-results__loader
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
      <p class="text-color--neutral-gray-500 font-small margin-top--4">
        Récupération des work items en cours...
      </p>
    </div>

    <PAlert
      v-else-if="error !== null"
      pType="error"
      class="margin-bottom--4"
    >
      {{ error }}
    </PAlert>

    <template v-else>
      <PAlert
        v-if="hasWarnings"
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

      <PAlert
        v-if="hasPartialErrors"
        pType="warning"
        class="margin-bottom--4"
      >
        Certains work items n'ont pas pu être récupérés (IDs: {{ failedWorkItemIds.join(', ') }})
      </PAlert>

      <div
        v-if="hasResults"
        class="work-items-results__header flex flex--align-items-center flex-gap--2 margin-bottom--4"
      >
        <PTag
          pColor="info"
          :pContent="workItemsCountLabel"
        />
        <PButton
          pType="default"
          pSize="small"
          @click="handleCopyAsTeamsExport"
        >
          <PIcon pName="clipboardData" class="margin-right--1" />
          Message MEP Standard
        </PButton>
        <PButton
          pType="default"
          pSize="small"
          @click="handleCopyWorkItemsOnly"
        >
          <PIcon pName="cardList" class="margin-right--1" />
          Work Items uniquement
        </PButton>
      </div>

      <template v-if="isMultiRepoMode">
        <PCollapse
          v-if="hasResults"
          v-model="activeRepositories"
        >
          <PCollapseItem
            v-for="repoName in sortedRepositoryNames"
            :key="`repo-${repoName}`"
            pType="default"
            pIconName="circleCheckDuotone"
            :name="`repo-${repoName}`"
            :pTitleCollapseItem="`${repoName} (${getRepoWorkItemsCount(repoName)})`"
            pFullBody
          >
            <PCollapse :key="`collapse-${repoName}`">
              <PCollapseItem
                v-for="teamName in getSortedTeamNamesForRepo(repoName)"
                :key="`${repoName}-${teamName}`"
                pType="gray"
                pIconName="people"
                :name="teamName"
                :pTitleCollapseItem="getRepoTeamTitle(repoName, teamName)"
                pFullBody
              >
                <template #before-title>
                  <PIcon
                    v-if="hasIncompleteWorkItemsInRepo(repoName, teamName)"
                    pName="exclamationTriangle"
                    pSize="16"
                    class="
                      text-color--danger-500
                      margin-right--2
                      work-items-results__warning-icon
                    "
                  />
                </template>
                <PTable
                  :pData="workItemsByRepository[repoName][teamName]"
                  pSize="small"
                  class="work-items-results__table margin-top--0"
                  :pRowClassName="getRowClassName"
                >
                  <PTableColumn
                    pProp="id"
                    pLabel="ID"
                    pWidth="100"
                  >
                    <template #default="{ row }">
                      <a
                        :href="row.webUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="work-items-results__link"
                      >
                        {{ row.id }}
                      </a>
                    </template>
                  </PTableColumn>
                  <PTableColumn
                    pProp="title"
                    pLabel="Titre"
                  />
                  <PTableColumn
                    pProp="type"
                    pLabel="Type"
                    pWidth="120"
                  >
                    <template #default="{ row }">
                      <PTag
                        :pColor="getTypeColor(row.type)"
                        :pContent="row.type"
                        pSize="small"
                      />
                    </template>
                  </PTableColumn>
                  <PTableColumn
                    pProp="state"
                    pLabel="État"
                    pWidth="120"
                  >
                    <template #default="{ row }">
                      <PTag
                        :pColor="getStateColor(row.state)"
                        :pContent="row.state"
                        pSize="small"
                      />
                    </template>
                  </PTableColumn>
                </PTable>
              </PCollapseItem>
            </PCollapse>
          </PCollapseItem>

          <PCollapseItem
            v-for="repoName in reposWithoutMepTag"
            :key="`repo-missing-mep-tag-${repoName}`"
            pType="default"
            :name="`repo-missing-mep-tag-${repoName}`"
            :pTitleCollapseItem="`${repoName} : Aucun tag MEP trouvé pour le repository.`"
            pDisabled
          >
            <template #before-title>
              <PIcon
                pName="exclamationTriangle"
                pSize="16"
                class="
                  text-color--orange-800
                  margin-right--2
                "
              />
            </template>
          </PCollapseItem>

          <PCollapseItem
            v-for="repoName in reposWithFetchError"
            :key="`repo-fetch-error-${repoName}`"
            pType="default"
            :name="`repo-fetch-error-${repoName}`"
            :pTitleCollapseItem="`${repoName} : Erreur lors de la récupération des work items pour le repository.`"
            pDisabled
          >
            <template #before-title>
              <PIcon
                pName="exclamationTriangle"
                pSize="16"
                class="
                  text-color--orange-800
                  margin-right--2
                "
              />
            </template>
          </PCollapseItem>

          <PCollapseItem
            v-for="repoName in reposWithNoWorkItems"
            :key="`repo-no-items-${repoName}`"
            pType="default"
            pIconName="circleCheckDuotone"
            :name="`repo-no-items-${repoName}`"
            :pTitleCollapseItem="`${repoName} (0)`"
            pDisabled
          />
        </PCollapse>
      </template>

      <template v-else>
        <PCollapse
          v-if="hasResults"
          v-model="activeTeams"
        >
          <PCollapseItem
            v-for="teamName in sortedTeamNames"
            :key="teamName"
            pType="gray"
            pIconName="people"
            :name="teamName"
            :pTitleCollapseItem="`${getTeamDisplayName(teamName)} (${workItemsByTeam[teamName].length})`"
            pFullBody
          >
            <template #before-title>
              <PIcon
                v-if="hasIncompleteWorkItems(teamName)"
                pName="exclamationTriangle"
                pSize="16"
                class="
                  text-color--danger-500
                  margin-right--2
                  work-items-results__warning-icon
                "
              />
            </template>
            <PTable
              :pData="workItemsByTeam[teamName]"
              pSize="small"
              class="work-items-results__table margin-top--0"
              :pRowClassName="getRowClassName"
            >
              <PTableColumn
                pProp="id"
                pLabel="ID"
                pWidth="100"
              >
                <template #default="{ row }">
                  <a
                    :href="row.webUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="work-items-results__link"
                  >
                    {{ row.id }}
                  </a>
                </template>
              </PTableColumn>
              <PTableColumn
                pProp="title"
                pLabel="Titre"
              />
              <PTableColumn
                pProp="type"
                pLabel="Type"
                pWidth="120"
              >
                <template #default="{ row }">
                  <PTag
                    :pColor="getTypeColor(row.type)"
                    :pContent="row.type"
                    pSize="small"
                  />
                </template>
              </PTableColumn>
              <PTableColumn
                pProp="state"
                pLabel="État"
                pWidth="120"
              >
                <template #default="{ row }">
                  <PTag
                    :pColor="getStateColor(row.state)"
                    :pContent="row.state"
                    pSize="small"
                  />
                </template>
              </PTableColumn>
            </PTable>
          </PCollapseItem>
        </PCollapse>
      </template>

      <div
        v-if="hasResults === false && hasPartialErrors === false"
        class="work-items-results__empty text-center padding--6"
      >
        <p class="text-color--neutral-gray-500">
          Aucun work item trouvé pour cette plage de commits.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PLoader,
  PAlert,
  PTag,
  PCollapse,
  PCollapseItem,
  PTable,
  PTableColumn,
  PButton,
  PIcon,
} from '@pulse/styleguide/components'
import type { PTagProps } from '@pulse/styleguide/types'
import {
  WORK_ITEM_TYPE_COLORS,
  WORK_ITEM_STATE_COLORS,
  WORK_ITEM_COMPLETED_STATES,
} from '@backoffice/constants/azure-devops.const'
import { copyWorkItemsAsTeamsExport, copyWorkItemsOnly } from '@backoffice/utils/work-items-clipboard.utils'
import type { WorkItemsResultsProps } from './work-items-results.types'

type TagColor = NonNullable<PTagProps['pColor']>

const props = defineProps<WorkItemsResultsProps>()
const activeTeams = ref<string[]>([])
const activeRepositories = ref<string[]>([])

const handleCopyAsTeamsExport = () => {
  copyWorkItemsAsTeamsExport({
    workItemsByTeam: props.workItemsByTeam,
    sortedTeamNames: props.sortedTeamNames,
    workItemsByRepository: props.workItemsByRepository,
    sortedRepositoryNames: props.sortedRepositoryNames,
  })
}

const handleCopyWorkItemsOnly = () => {
  copyWorkItemsOnly({
    workItemsByTeam: props.workItemsByTeam,
    sortedTeamNames: props.sortedTeamNames,
    workItemsByRepository: props.workItemsByRepository,
    sortedRepositoryNames: props.sortedRepositoryNames,
    repositoryName: props.repositoryName,
  })
}

const workItemsCountLabel = computed(() => {
  const count = props.totalWorkItems
  return `${count} work item${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
})

const getTypeColor = (type: string): TagColor => {
  return (WORK_ITEM_TYPE_COLORS as Record<string, TagColor>)[type] ?? 'gray'
}

const getStateColor = (state: string): TagColor => {
  return (WORK_ITEM_STATE_COLORS as Record<string, TagColor>)[state] ?? 'gray'
}

const isWorkItemIncomplete = (state: string): boolean => {
  return WORK_ITEM_COMPLETED_STATES.includes(state as typeof WORK_ITEM_COMPLETED_STATES[number]) === false
}

const getIncompleteWorkItemsCount = (teamName: string): number => {
  const workItems = props.workItemsByTeam[teamName]
  return workItems.filter((wi) => isWorkItemIncomplete(wi.state)).length
}

const hasIncompleteWorkItems = (teamName: string): boolean => {
  return getIncompleteWorkItemsCount(teamName) > 0
}

const getIncompleteWorkItemsCountForRepo = (repoName: string, teamName: string): number => {
  const workItems = props.workItemsByRepository[repoName]?.[teamName]
  if (workItems === undefined) {
    return 0
  }
  return workItems.filter((wi) => isWorkItemIncomplete(wi.state)).length
}

const hasIncompleteWorkItemsInRepo = (repoName: string, teamName: string): boolean => {
  return getIncompleteWorkItemsCountForRepo(repoName, teamName) > 0
}

const getRepoWorkItemsCount = (repoName: string): number => {
  const teamItems = props.workItemsByRepository[repoName]
  if (teamItems === undefined) {
    return 0
  }
  return Object.values(teamItems).reduce((sum, items) => sum + items.length, 0)
}

const getSortedTeamNamesForRepo = (repoName: string): string[] => {
  const teamItems = props.workItemsByRepository[repoName]
  if (teamItems === undefined) {
    return []
  }
  return Object.keys(teamItems).sort((a, b) => {
    const countA = teamItems[a].length
    const countB = teamItems[b].length
    return countB - countA
  })
}

const getRepoTeamTitle = (repoName: string, teamName: string): string => {
  const count = props.workItemsByRepository[repoName]?.[teamName]?.length ?? 0
  return `${getTeamDisplayName(teamName)} (${count})`
}

const getRowClassName = ({ row }: { row: { state: string } }): string => {
  return isWorkItemIncomplete(row.state) ? 'work-items-results__row--incomplete' : ''
}

const getTeamDisplayName = (teamName: string): string => {
  return teamName.trim() === '' ? 'Liste de work items' : teamName
}
</script>

<style lang="scss" scoped>
.work-items-results {
  &__loader {
    min-height: 200px;
  }

  &__link {
    color: var(--el-color-primary);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  &__empty {
    background-color: var(--el-fill-color-lighter);
    border-radius: 8px;
  }

  :deep(.work-items-results__row--incomplete) {
    background-color: var(--el-color-danger-light-9);
  }
}
</style>
