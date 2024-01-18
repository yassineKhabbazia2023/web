<template>
  <Story title="2. Atoms/ExpandableSearch" icon="tabler:search">
    <Variant title="Basic Usage">
      <PExpandableSearch :pPlaceholder="placeholder" @input="logEvent('input', $event)" />
      <template #controls>
        <HstText v-model="placeholder" title="Placeholder" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import PExpandableSearch from './'
import { ref } from 'vue'

const placeholder = ref('')
</script>
