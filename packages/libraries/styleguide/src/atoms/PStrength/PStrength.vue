<template>
  <div>
    <ul
      class="
        flex
        flex--justify-content-space-between
        list-style-none
        flex-gap--half
      "
    >
      <li
        v-for="index in rangeCount"
        :key="index"
        :class="index <= modelValue ? activeCssClassName : neutralCssClassName"
        class="
          flex--grow-1
          strengthLevel
        "
      />
    </ul>
    <div
      class="font-semibold"
      :class="labelCssClassName"
    >
      {{ label }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PStrengthProps } from './PStrength.types'
import { PStrengthLevelColor } from './PStrength.const'
import { getBgClassName, getTextClassName } from './PStrength.utils'

const props = defineProps<PStrengthProps>()
const neutralColor = PStrengthLevelColor[0]

const activeColor = computed(() => PStrengthLevelColor[props.modelValue])
const neutralCssClassName = computed(() => getBgClassName(neutralColor))
const activeCssClassName = computed(() => getBgClassName(activeColor.value))
const labelCssClassName = computed(() => getTextClassName(activeColor.value))
const rangeCount = Object.keys(PStrengthLevelColor).length - 1

const label = computed(() => props.labels[props.modelValue])
</script>

<style lang="scss" scoped>
.strengthLevel {
  height: 4px;
}
</style>
