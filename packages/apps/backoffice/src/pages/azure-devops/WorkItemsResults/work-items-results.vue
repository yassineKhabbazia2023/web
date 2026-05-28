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
              pMinWidth="300"
            />

            <PTableColumn
              pProp="type"
              pLabel="Type"
              pWidth="140"
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
import type { WorkItemsByTeam } from '@backoffice/types/azure-devops.type'
import type { PTagProps } from '@pulse/styleguide/types'
import {
  WORK_ITEM_TYPE_COLORS,
  WORK_ITEM_STATE_COLORS,
  WORK_ITEM_COMPLETED_STATES,
} from '@backoffice/constants/azure-devops.const'
import { copyWorkItemsAsTeamsExport, copyWorkItemsOnly } from '@backoffice/utils/work-items-clipboard.utils'

type TagColor = NonNullable<PTagProps['pColor']>

const props = defineProps<{
  workItemsByTeam: WorkItemsByTeam
  sortedTeamNames: string[]
  totalWorkItems: number
  isLoading: boolean
  error: string | null
  failedWorkItemIds: number[]
  warnings: string[]
  hasResults: boolean
  hasPartialErrors: boolean
  hasWarnings: boolean
  repositoryName?: string
}>()

const activeTeams = ref<string[]>([])

const handleCopyAsTeamsExport = () => {
  copyWorkItemsAsTeamsExport({
    workItemsByTeam: props.workItemsByTeam,
    sortedTeamNames: props.sortedTeamNames,
  })
}

const handleCopyWorkItemsOnly = () => {
  copyWorkItemsOnly({
    workItemsByTeam: props.workItemsByTeam,
    sortedTeamNames: props.sortedTeamNames,
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
