<template>
  <PTable
    data-testid="pr-completion-time-table"
    :pData="props.items"
    empty-text="Aucune PR complétée sur cette période"
    class="width--100 border-radius--2"
  >
    <PTableColumn
      pLabel="PR"
      pWidth="80px"
    >
      <template #default="{ row }">
        <a
          :href="buildPrUrl(row.repositoryName, row.pullRequestId)"
          target="_blank"
          rel="noopener noreferrer"
          class="text-color--primary"
        >
          #{{ row.pullRequestId }}
        </a>
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Titre"
      pMinWidth="250px"
    >
      <template #default="{ row }">
        <PTooltip
          :pContent="row.title"
          pPlacement="top"
        >
          <span class="pr-completion-time-table__title">
            {{ row.title }}
          </span>
        </PTooltip>
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Repository"
      pWidth="160px"
    >
      <template #default="{ row }">
        <PTag
          pSize="default"
          pColor="info"
          pRound
          :pContent="row.repositoryName"
        />
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Auteur"
      pWidth="150px"
    >
      <template #default="{ row }">
        {{ row.author }}
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Créé le"
      pWidth="160px"
      pSortable
      pProp="creationDate"
    >
      <template #default="{ row }">
        {{ formatCommitDate(row.creationDate) }}
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Fermé le"
      pWidth="160px"
    >
      <template #default="{ row }">
        <template v-if="row.closedDate !== null">
          {{ formatCommitDate(row.closedDate) }}
        </template>
        <span
          v-else
          class="text-color--neutral-gray-400"
        >
          -
        </span>
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Durée"
      pWidth="120px"
      pSortable
      pProp="durationHours"
    >
      <template #default="{ row }">
        <PTag
          pSize="default"
          pRound
          :pColor="getDurationColor(row.durationHours)"
          :pContent="row.durationFormatted"
        />
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Statut"
      pWidth="110px"
    >
      <template #default="{ row }">
        <PTag
          pSize="default"
          pRound
          :pColor="row.status === 'active' ? 'warning' : 'success'"
          :pContent="row.status === 'active' ? 'En cours' : 'Mergée'"
        />
      </template>
    </PTableColumn>

    <PTableColumn
      pLabel="Branche"
      pWidth="200px"
    >
      <template #default="{ row }">
        <PTooltip
          :pContent="cleanBranchName(row.sourceRefName)"
          pPlacement="top"
        >
          <span class="pr-completion-time-table__branch">
            {{ cleanBranchName(row.sourceRefName) }}
          </span>
        </PTooltip>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { PTable, PTableColumn, PTag, PTooltip } from '@pulse/styleguide/components'
import { formatCommitDate } from '../ContributionGraph/contribution-graph.helper'
import { cleanBranchName, getDurationColor, buildPrUrl } from './pr-completion-time.helper'
import type { PrCompletionTimeTableProps } from './pr-completion-time.types'

const props = defineProps<PrCompletionTimeTableProps>()
</script>

<style scoped>
.pr-completion-time-table__title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.pr-completion-time-table__branch {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  font-family: monospace;
  font-size: 12px;
}
</style>
