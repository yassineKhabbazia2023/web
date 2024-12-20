<template>
  <ElIcon
    class="p-icon"
    :size="pSize"
    :color="pColor"
  >
    <component
      :is="resolvedIconComponent"
      v-if="resolvedIconComponent && $slots.default === undefined"
    />
    <slot v-if="$slots.default" />
  </ElIcon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { getIconComponent } from '../../utils/iconHelper'
import type { PIconProps } from './PIcon.types'

const props = defineProps<PIconProps>()

const resolvedIconComponent = computed(() => getIconComponent(props.pName))
</script>

<style scoped>
.el-icon.p-icon {
  transition: color 100ms ease-in
}
</style>
