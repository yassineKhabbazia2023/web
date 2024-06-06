<template>
  <UsersCollab v-if="isCollab" />
  <UsersClient
    v-else
    :currentEntityId="currentEntityId"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import UsersCollab from '@/pages/folder/pages/usersCollab'
import UsersClient from '@/pages/folder/pages/usersClient'

const { isCollab } = storeToRefs(commonStore())
const route = useRoute()

const currentEntityId = computed(() => {
  const isChildFolder = route.matched.some(({ name }) => name === 'folder')
  if (!isChildFolder) {
    return undefined
  }
  const parsedEntityId = parseInt(`${route.params.id}`)

  return Number.isNaN(parsedEntityId) ? undefined : parsedEntityId
})
</script>
