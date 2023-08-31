<template>
  <el-menu
    :class="[{'hidden-lg-and-up': hideOnDesktop}, 'el-menu--bottom']"
    :router="useRouter"
    mode="horizontal"
  >
    <el-menu-item
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
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, type Component } from 'vue'

export interface Item {
  icon: string
  name: string
  path: string
  component: Component
}

export interface Props {
  hideOnDesktop?: boolean
  useRouter?: boolean
  items: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  hideOnDesktop: true,
  useRouter: true
})

const itemsMapped = props.items.map(({ name, path, icon }) => ({
  name,
  icon,
  index: path
}))

const createIcon = (name: string) =>
  defineAsyncComponent(() => import(`../../atoms/PIcon/components/${name}.vue`))
</script>
