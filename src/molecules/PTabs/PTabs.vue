<template>
  <ElTabs
    :type="pType"
    :closable="pClosable"
    :addable="pAddable"
    :editable="pEditable"
    :tabPosition="pTabPosition"
    :stretch="pStretch"
    :beforeLeave="pBeforeLeave"
  >
    <slot />
  </ElTabs>
</template>

<script lang="ts" setup>
import { ElTabs } from 'element-plus'
import type { PTabsProps } from './PTabsTypes'

withDefaults(defineProps<PTabsProps>(), {
  pType: '',
  pClosable: false,
  pAddable: false,
  pEditable: false,
  pTabPosition: 'top',
  pStretch: false,
  pBeforeLeave: undefined
})
</script>
