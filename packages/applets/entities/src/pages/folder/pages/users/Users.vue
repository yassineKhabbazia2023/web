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
import { useUserStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import UsersCollab from '@entities/pages/folder/pages/usersCollab'
import UsersClient from '@entities/pages/folder/pages/usersClient'


const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)
const route = useRoute()

const entityId = computed(() => {
  const isChildFolder = route.matched.some(({ name }) => name === 'folder')
  if (!isChildFolder) {
    return undefined
  }
  const parsedEntityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

  return parsedEntityId !== null ? parsedEntityId : undefined
})
</script>
