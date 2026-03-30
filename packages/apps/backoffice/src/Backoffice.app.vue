<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { BackofficeAuthService } from '@backoffice/services/backoffice.auth.service'

onMounted(() => {
  BackofficeAuthService.init()
})
</script>
