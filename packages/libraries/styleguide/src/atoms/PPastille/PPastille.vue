<template>
  <ElTag
    class="p-pastille"
    :class="[ pClassMapper,{ 'p-pastille--disabled': props.pDisabled } ]"
    round
  >
    <PIcon v-if="!!pIconName">
      <component :is="dynamicImportedIcon" />
    </PIcon>
    <slot v-else />
  </ElTag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTag } from 'element-plus'
import { iconResolver } from '@styleguide/utils/iconResolver'
import type { PPastilleProps } from './PPastilleTypes'
import PIcon from '../PIcon'

const props = withDefaults(defineProps<PPastilleProps>(), {
  pType: 'default',
  pSize: 'default',
  pDisabled: false,
  pIconName: '',
})

const pClassMapper = computed(() => ({
  [`p-pastille--type-${props.pType}`]: true,
  [`p-pastille--size-${props.pSize}`]: true,
}))

const dynamicImportedIcon = iconResolver(props.pIconName)
</script>
