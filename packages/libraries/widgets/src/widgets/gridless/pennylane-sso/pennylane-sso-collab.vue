<template>
  <PennylaneSSO :SSOUrl="VITE_PENNYLANE_COLLAB_SSO_URL" />
</template>

<script lang="ts" setup>
import PennylaneSSO from './pennylane-sso.vue'
import { VITE_PENNYLANE_COLLAB_SSO_URL } from 'env-vars'
</script>
