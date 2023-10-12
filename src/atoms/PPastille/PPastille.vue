<template>
  <ElTag
    class="p-pastille"
    :class="{
      'p-pastille--default': kind === 'default',
      'p-pastille--warning': kind === 'warning',
      'p-pastille--persian': kind === 'persian',
      'p-pastille--small': size === 'small',
      'p-pastille--disabled': disabled,
    }"
    round
  >
    <PIcon v-if="!!iconName">
      <component :is="dynamicImportedIcon"></component>
    </PIcon>
    <slot v-else />
  </ElTag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import { iconResolver } from '@/utils/iconResolver'

export interface PPastilleProps {
  kind?: 'default' | 'warning' | 'persian';
  size?: 'default' | 'small';
  disabled?: boolean;
  iconName?: string;
}

const props = withDefaults(defineProps<PPastilleProps>(), {
  kind: 'default',
  size: 'default',
  disabled: false,
  iconName: ''
})

const dynamicImportedIcon = iconResolver(props.iconName)
</script>
