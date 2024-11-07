<template>
  <ElMenu
    :class="[
      'p-menu',
      { 'p-menu--collapsed' : pCollapse }
    ]"
    :mode="pMode"
    :ellipsis="pEllipsis"
    :defaultActive="pDefaultActive"
    :router="pRouter"
    :defaultOpeneds="pDefaultOpeneds"
    :uniqueOpened="pUniqueOpened"
    :menuTrigger="pMenuTrigger"
    :collapseTransition="pCollapseTransition"
  >
    <slot />
  </ElMenu>
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus'
import type { PMenuProps } from './PMenuTypes'

withDefaults(defineProps<PMenuProps>(), {
  pMode: 'vertical',
  pCollapse: false,
  pEllipsis: true,
  pDefaultActive: '',
  pRouter: false,
  pDefaultOpeneds: undefined,
  pUniqueOpened: false,
  pMenuTrigger: 'hover',
  pCollapseTransition: true,
})
</script>
