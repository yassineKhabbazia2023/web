<template>
  <el-menu
    backgroundColor="var(--el-color-neutral-gray-700)"
    hoverBackgroundColor="var(--el-color-secondary-cyan-bg)"
    textColor="white"
    class="el-menu--navbar hidden-sm-and-down"
    :collapse="isCollapse"
    router
  >
    <el-menu-item
      class="title"
    >
      <span class="menu-name"><slot name="title" /></span>
      <PIcon
        @click="collapseMenu"
        class="icon-collapse"
      >
        <PIArrowBarRight v-show="isCollapse" />
        <PIArrowBarLeft v-show="!isCollapse" />
      </PIcon>
    </el-menu-item>
    <el-menu-item
      v-for="(item, index) in menuList"
      :index="item.path"
      :key="index"
    >
      <PIcon>
        <component :is="createIcon(item.icon)" />
      </PIcon>
      <span class="menu-name">{{ item.name }}</span>
    </el-menu-item>
    <div class="divider">
      <el-divider />
    </div>
    <el-menu-item
      v-for="(item, index) in entities"
      :key="item.idAccount"
      @click="handleClickEntity(item.idAccount)"
      :index="`${index + 2}`"
    >
      <PIcon class="icon-entity" :style="`background-color: ${item.color}`">
        <component :is="createIcon(item.icon)" />
      </PIcon>
      <span class="font-bold menu-name">{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
  <el-menu
    mode="horizontal"
    backgroundColor="var(--el-color-neutral-gray-700)"
    activeTextColor="var(--el-color-white)"
    textColor="white"
    class="el-menu-horizontal hidden-md-and-up"
    router
  >
    <el-menu-item
      v-for="(item, index) in entities"
      @click="handleClickEntity(item.idAccount)"
      :key="item.idAccount"
      :index="`${index}`"
    >
      <PIcon class="icon-entity" :style="`background-color: ${item.color};`">
        <component :is="createIcon(item.icon)" />
      </PIcon>
      <span class="font-bold menu-name">{{ item.name }}</span>
    </el-menu-item>
    <el-menu-item
      :class="`icon-collapse icon-horizontale-index-${index}`"
      v-for="(item, index) in menuList"
      :index="item.path"
      :key="index"
    >
      <PIcon>
        <component :is="createIcon(item.icon)" />
      </PIcon>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { type PropType, ref, defineAsyncComponent } from 'vue'

interface EntityProps {
  idAccount: string
  name: string
  icon: string
  color: string
}

interface MenuProps {
  name: string
  path: string
  icon: string
}

const isCollapse = ref(true)

defineProps({
  entities: Object as PropType<EntityProps[]>,
  menuList: Object as PropType<MenuProps[]>,
  handleClickEntity: { type: Function, required: true }
})

const collapseMenu = () => {
  isCollapse.value = !isCollapse.value
}

const createIcon = (name: string) => {
  return defineAsyncComponent(() => import(`../PIcon/components/${name}.vue`))
}
</script>
