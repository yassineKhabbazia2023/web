<template>
  <div>
    <component
      :is="widget"
      v-for="(widget, index) in WidgetsManager.getWidgets()"
      :key="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { WidgetsManager } from '@pulse/modules/managers'
</script>
