<template>
  <el-menu
    mode="horizontal"
    class="header-tabs hidden-xs-only"
    :ellipsis=false
    router
  >
    <el-menu-item
      v-for="item in menu.slice(0, 4)"
      class="menu-item"
      :index="item.path"
      :route="{ path: item.path }"
      :key="item.path"
    >
      <PIcon>
        <component :is="createIcon(item.icon)" />
      </PIcon>
      <template #title>
        {{ item.text }}
      </template>
    </el-menu-item>
    <el-sub-menu
      index="2"
      v-if="menu.length > 4"
    >
      <template #title>
        <PIcon>
          <component :is="createIcon('PIThreeDots')" />
        </PIcon>
        Plus
      </template>
      <el-menu-item
        v-for="item in menu.slice(4)"
        class="menu-item"
        :index="item.path"
        :route="{ path: item.path }"
        :key="item.path"
      >
        <PIcon>
          <component :is="createIcon(item.icon)" />
        </PIcon>
        <template #title>
          {{ item.text }}
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script setup lang="ts">
import PIcon from '@/atoms/PIcon'
import { defineAsyncComponent } from 'vue'

interface IMenu {
  icon: string
  text: string
  path: string
}

interface PHeaderProps {
  menu: IMenu[]
}

withDefaults(defineProps<PHeaderProps>(), {
  menu: () => []
})

const createIcon = (name: string) => {
  return defineAsyncComponent(() => import(`../PIcon/components/${name}.vue`))
}
</script>
