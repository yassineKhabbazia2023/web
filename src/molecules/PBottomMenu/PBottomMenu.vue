<template>
  <ElMenu
    :class="[{ 'hidden-lg-and-up': pHideOnDesktop }, 'el-menu--bottom']"
    :router="pUseRouter"
    mode="horizontal"
  >
    <ElMenuItem
      v-for="item in itemsMapped"
      :key="item.index"
      :index="item.index"
    >
      <div class="el-menu-item-content">
        <PIcon size="16px">
          <component :is="createIcon(item.icon)" />
        </PIcon>
        <p>{{ item.name }}</p>
      </div>
    </ElMenuItem>
  </ElMenu>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import type { PBottomMenuProps } from './PBottomMenuTypes'

const props = withDefaults(defineProps<PBottomMenuProps>(), {
  pHideOnDesktop: true,
  pUseRouter: true
})

const itemsMapped = props.pItems.map(({ pName, pPath, pIcon }) => ({
  name: pName,
  index: pPath,
  icon: pIcon
}))

const createIcon = (name: string) =>
  defineAsyncComponent(() => import(`../../atoms/PIcon/components/${name}.vue`))
</script>
