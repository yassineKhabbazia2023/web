<template>
  <ul
    class="
      list-style-none
      font-size--12
      flex
      flex--wrap
      flex-gap--6
    "
  >
    <li
      v-for="entry in entries"
      :key="entry.label"
      class="
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <i
        class="key-moments-legend__swatch"
        :style="{ backgroundColor: entry.color }"
      />
      {{ entry.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
// Names the colours rather than the series: several terms of a composition can share one colour
import type { ChartLegendEntry } from '../../types/key-moments.types'

defineProps<{
  entries: ChartLegendEntry[]
}>()
</script>

<style scoped lang="scss">
.key-moments-legend__swatch {
  width: 12px;
  height: 12px;
}
</style>
