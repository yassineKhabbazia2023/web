<template>
  <ElIcon
    class="p-icon"
    :size="pSize"
    :color="pColor"
  >
    <component
      v-if="resolvedIconComponent && $slots.default === undefined"
      :is="resolvedIconComponent"
    />
    <slot v-if="$slots.default" />
  </ElIcon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { iconResolver } from '@/utils/iconResolver'
import { capitalize } from '@/utils/text'
// eslint-disable-next-line import/extensions
import type { PIconProps } from './PIcon.types'
const props = defineProps<PIconProps>()

const resolvedIconComponent = computed(() => {
  if (props.pName === undefined) {
    return null
  }

  return iconResolver(`PI${capitalize(props.pName)}`)
})

</script>

<style scoped>
.el-icon.p-icon {
  transition: color 100ms ease-in
}
</style>
