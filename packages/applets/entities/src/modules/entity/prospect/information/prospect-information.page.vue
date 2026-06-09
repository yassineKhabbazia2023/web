<template>
  <Information :pHiddenFieldKeys="PROSPECT_HIDDEN_FIELD_KEYS" />
</template>

<script setup lang="ts">
import Information from '../../regular/information/Information.vue'

const PROSPECT_HIDDEN_FIELD_KEYS = ['email']
</script>
