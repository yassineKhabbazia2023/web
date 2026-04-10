<template>
  <div>
    <h1>Prospect Collaborators</h1>
    <pre>{{ route.params }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
