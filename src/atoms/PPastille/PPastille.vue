<template>
  <el-tag
    class="p-pastille"
    :class="{
      'p-pastille--default': kind === 'default',
      'p-pastille--warning': kind === 'warning',
      'p-pastille--disabled': disabled,
    }"
    round
  >
    <PIcon v-if="!!iconName">
      <component :is="dynamicImportedIcon"></component>
    </PIcon>
    <slot v-else />
  </el-tag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import { iconResolver } from '@/utils/iconResolver'
import PIcon from '@/atoms/PIcon'

interface PPastilleProps {
  kind?: 'default' | 'warning';
  disabled?: boolean;
  iconName?: string;
}

const props = withDefaults(defineProps<PPastilleProps>(), {
  kind: 'default',
  disabled: false,
  iconName: ''
})

const dynamicImportedIcon = iconResolver(props.iconName)
</script>
