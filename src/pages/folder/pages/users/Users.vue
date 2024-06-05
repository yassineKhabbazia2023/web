<template>
  <UsersCollab v-if="isCollab" />
  <UsersClient v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import UsersCollab from '@/pages/folder/pages/usersCollab'
import UsersClient from '@/pages/folder/pages/usersClient'

const { isCollab } = storeToRefs(commonStore())
</script>
