<template>
  <PDialog
    v-model="isOpen"
    pTitle="Explorer les commits (main)"
    pWidth="900px"
    :pBeforeClose="handleBeforeClose"
  >
    <CommitExplorerList
      :commits="commits"
      :isLoading="isLoading"
      :isLoadingMore="isLoadingMore"
      :error="error"
      :hasMore="hasMore"
      :repository="repository"
      scrollable
      @commit-click="handleCommitClick"
      @load-more="loadMore"
    />
  </PDialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { PDialog } from '@pulse/styleguide/components'
import CommitExplorerList from '../CommitExplorer/commit-explorer-list.vue'
import { useCommitExplorer } from '../CommitExplorer/use-commit-explorer.composable'

defineProps<{
  repository: string
}>()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  'commit-selected': [commitId: string]
}>()

const {
  commits,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  load,
  loadMore,
  reset,
} = useCommitExplorer()

const handleBeforeClose = (done: () => void): void => {
  if (isLoading.value === false) {
    done()
  }
}

const handleCommitClick = (commitId: string): void => {
  emit('commit-selected', commitId)
  isOpen.value = false
}

watch(isOpen, (newValue) => {
  if (newValue) {
    load()
  } else {
    reset()
  }
})
</script>
