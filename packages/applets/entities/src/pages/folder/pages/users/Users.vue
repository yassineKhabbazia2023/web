<template>
  <UsersCollab v-if="isCollab" />
  <UsersClient
    v-else
    :entityId="entityId"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { commonStore } from '@pulse/Common'
import UsersCollab from '@entities/pages/folder/pages/usersCollab'
import UsersClient from '@entities/pages/folder/pages/usersClient'

const { isCollab } = storeToRefs(commonStore())
const route = useRoute()

const entityId = computed(() => {
  const isChildFolder = route.matched.some(({ name }) => name === 'folder')
  if (!isChildFolder) {
    return undefined
  }
  const parsedEntityId = parseInt(`${route.params.id}`)

  return Number.isNaN(parsedEntityId) ? undefined : parsedEntityId
})
</script>
