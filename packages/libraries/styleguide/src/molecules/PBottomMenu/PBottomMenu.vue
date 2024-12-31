<template>
  <ElMenu
    :class="[{ 'hidden-lg-and-up': pHideOnDesktop }, 'el-menu--bottom']"
    :router="pUseRouter"
    mode="horizontal"
  >
    <ElMenuItem
      v-for="(item, index) in pItems"
      :key="index"
      :index="item.pPath"
    >
      <div class="el-menu-item-content">
        <PIcon
          size="16px"
          :pName="item.pIconName"
        />
        <p>{{ item.pName }}</p>
      </div>
    </ElMenuItem>
  </ElMenu>
</template>

<script lang="ts" setup>
import { ElMenu, ElMenuItem } from 'element-plus'
import PIcon from '../../atoms/PIcon'
import type { PBottomMenuProps } from './PBottomMenuTypes'

const props = withDefaults(defineProps<PBottomMenuProps>(), {
  pHideOnDesktop: true,
  pUseRouter: true,
})
</script>
