<template>
  <div
    class="commit-explorer-list"
    :class="{ 'commit-explorer-list--scrollable': scrollable }"
  >
    <div
      v-if="isLoading"
      class="
        commit-explorer-list__loader
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
        Chargement des commits...
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
      <div
        v-for="commit in commits"
        :key="commit.commitId"
        class="commit-explorer-list__row"
        data-testid="commit-row"
        @click="$emit('commitClick', commit.commitId)"
      >
        <div class="commit-explorer-list__main-line">
          <code class="commit-explorer-list__commit-id">{{ commit.shortCommitId }}</code>
          <span
            v-if="getUniqueTeams(commit).length > 0"
            class="commit-explorer-list__teams"
          >{{ getUniqueTeams(commit).join(', ') }}</span>
          <span
            class="commit-explorer-list__message"
            v-html="formatMessageWithPRLinks(commit.comment)"
          />
        </div>
        <div class="commit-explorer-list__details-line">
          <span class="commit-explorer-list__commit-date">{{ formatDate(commit.author.date) }}</span>
          <div class="commit-explorer-list__details-content">
            <template v-if="commit.workItems.length > 0">
              <span
                v-for="wi in commit.workItems"
                :key="wi.id"
                class="flex flex--align-items-center flex-gap--1"
              >
                <PTooltip
                  :pContent="wi.title"
                  pPlacement="top"
                >
                  <a
                    :href="wi.webUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="commit-explorer-list__work-item-link"
                    @click.stop
                  >
                    #{{ wi.id }}
                  </a>
                </PTooltip>
                <PTag
                  :pColor="getStateColor(wi.state)"
                  :pContent="wi.state"
                  pSize="small"
                />
              </span>
            </template>
            <PTag
              v-for="tag in commit.tags"
              :key="tag"
              :pColor="getTagColor(tag)"
              :pContent="tag"
              pSize="small"
            />
          </div>
        </div>
      </div>

      <div
        v-if="commits.length === 0 && isLoading === false && error === null"
        class="commit-explorer-list__empty text-center padding--6"
      >
        <p class="text-color--neutral-gray-500">
          Aucun commit trouvé.
        </p>
      </div>

      <div
        v-if="hasMore"
        class="commit-explorer-list__load-more"
      >
        <PButton
          pType="tertiary"
          pSize="small"
          :pLoading="isLoadingMore"
          @click="$emit('loadMore')"
        >
          Voir plus
        </PButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  PLoader,
  PAlert,
  PTag,
  PTooltip,
  PButton,
} from '@pulse/styleguide/components'
import type { PTagProps } from '@pulse/styleguide/types'
import { escapeHtml } from '@pulse/toolbox/utils/html'
import { AZURE_DEVOPS_CONFIG, WORK_ITEM_STATE_COLORS } from '@backoffice/constants/azure-devops.const'
import type { CommitWithDetails } from '@backoffice/types/azure-devops.type'

type TagColor = NonNullable<PTagProps['pColor']>

const MAX_MESSAGE_LENGTH = 100
const MERGED_PR_REGEX = /Merged PR (\d+)/g

const props = withDefaults(defineProps<{
  commits: CommitWithDetails[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore?: boolean
  scrollable?: boolean
  repository?: string
}>(), {
  hasMore: true,
  scrollable: false,
  repository: AZURE_DEVOPS_CONFIG.repository,
})

defineEmits<{
  commitClick: [commitId: string]
  loadMore: []
}>()

const truncateMessage = (message: string): string => {
  const firstLine = message.split('\n')[0]
  if (firstLine.length <= MAX_MESSAGE_LENGTH) {
    return firstLine
  }
  return firstLine.substring(0, MAX_MESSAGE_LENGTH) + '...'
}

const buildPrUrl = (prId: string): string => {
  const baseUrl = AZURE_DEVOPS_CONFIG.organization
  const project = AZURE_DEVOPS_CONFIG.project
  return `${baseUrl}/${project}/_git/${props.repository}/pullrequest/${prId}`
}

const formatMessageWithPRLinks = (message: string): string => {
  const truncated = truncateMessage(message)
  const escaped = escapeHtml(truncated)
  return escaped.replace(MERGED_PR_REGEX, (_match, prId) => {
    const url = buildPrUrl(prId)
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="commit-explorer-list__pr-link" onclick="event.stopPropagation()">Merged PR ${prId}</a>`
  })
}

const getStateColor = (state: string): TagColor => {
  return (WORK_ITEM_STATE_COLORS as Record<string, TagColor>)[state] ?? 'gray'
}

const getTagColor = (tag: string): TagColor => {
  if (tag.startsWith('MEP')) {
    return 'dark-blue'
  }
  return 'gray'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getUniqueTeams = (commit: CommitWithDetails): string[] => {
  const teams = new Set<string>()
  for (const wi of commit.workItems) {
    if (wi.team) {
      teams.add(wi.team)
    }
  }
  return Array.from(teams)
}
</script>

<style lang="scss" scoped>
.commit-explorer-list {
  &--scrollable {
    max-height: 500px;
    overflow-y: auto;
  }

  &__loader {
    min-height: 300px;
  }

  &__row {
    padding: 4px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__main-line {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__commit-id {
    font-family: monospace;
    font-size: 12px;
    background-color: var(--el-fill-color);
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  &__teams {
    font-weight: 600;
    font-size: 12px;
    color: var(--el-text-color-primary);
    flex-shrink: 0;
  }

  &__commit-date {
    font-size: 10px;
    color: var(--el-text-color-secondary);
    min-width: 58px;
    text-align: center;
  }

  &__message {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;

    :deep(.commit-explorer-list__pr-link) {
      color: var(--el-color-primary);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__details-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 2px;
  }

  &__details-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &__work-item-link {
    color: var(--el-color-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 12px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__empty {
    background-color: var(--el-fill-color-lighter);
    border-radius: 8px;
  }

  &__load-more {
    display: flex;
    justify-content: center;
    padding: 8px;
  }
}
</style>
