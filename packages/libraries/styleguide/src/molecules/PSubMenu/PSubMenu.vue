<template>
  <ElSubMenu
    :index="pIndex"
    :popperClass="pPopperClass"
    :disabled="pDisabled"
    :popperOffset="pPopperOffset"
    :showTimeout="pShowTimeout"
    :hideTimeout="pHideTimeout"
    :expandCloseIcon="expandCloseIcon"
    :expandOpenIcon="expandOpenIcon"
    class="p-submenu"
    :data-testid="pTestId"
  >
    <template #title>
      <PIcon
        v-if="pIconName"
        class="p-submenu__icon"
        :pName="pIconName"
      />
      <span class="p-submenu__title margin-left--3">
        <slot name="title" />
      </span>
    </template>
    <slot />
  </ElSubMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElSubMenu } from 'element-plus'
import { getIconComponent } from '../../utils/iconHelper'
import type { PSubMenuProps } from './PSubMenuTypes'
import PIcon from '../../atoms/PIcon'

withDefaults(defineProps<PSubMenuProps>(), {
  pPopperClass: undefined,
  pPopperOffset: 0,
  pShowTimeout: undefined,
  pHideTimeout: undefined,
  pDisabled: false,
  pTestId: undefined,
})

const expandCloseIcon = computed(() => getIconComponent('caretDown'))
const expandOpenIcon = computed(() => getIconComponent('caretUp'))
</script>
