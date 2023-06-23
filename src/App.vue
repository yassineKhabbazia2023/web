<script setup lang="ts">
import HomeLayout from '@/layouts/Home'

</script>

<template>
  <component :is="$route.meta.layout || HomeLayout"/>
</template>
