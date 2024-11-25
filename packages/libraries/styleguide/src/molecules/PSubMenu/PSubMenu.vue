<template>
  <ElSubMenu
    :index="pIndex"
    :popperClass="pPopperClass"
    :disabled="pDisabled"
    :popperOffset="pPopperOffset"
    :showTimeout="pShowTimeout"
    :hideTimeout="pHideTimeout"
    :expandCloseIcon="PICaretDown"
    :expandOpenIcon="PICaretUp"
    class="p-submenu"
  >
    <template #title>
      <PIcon v-if="pIcon" class="p-submenu__icon">
        <component :is="iconResolver(pIcon)" />
      </PIcon>
      <span class="p-submenu__title margin-left--2">
        <slot name="title" />
      </span>
    </template>
    <slot />
  </ElSubMenu>
</template>

<script setup lang="ts">
import { iconResolver } from '../../utils/iconResolver'
import { ElSubMenu } from 'element-plus'
import { PICaretDown, PICaretUp } from '../../atoms/PIcon/components'
import type { PSubMenuProps } from './PSubMenuTypes'
import PIcon from '../../atoms/PIcon'

withDefaults(defineProps<PSubMenuProps>(), {
  pPopperClass: undefined,
  pPopperOffset: 0,
  pShowTimeout: undefined,
  pHideTimeout: undefined,
  pDisabled: false,
})
</script>
