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
        <p>{{ item.text }}</p>
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

interface Item {
  icon: string
  text: string
  path: string
}

interface Props {
  hideOnDesktop?: boolean
  useRouter?: boolean
  items: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  hideOnDesktop: true,
  useRouter: true
})

const itemsMapped = props.items.map(({ icon, text, path }) => ({
  icon,
  text,
  index: path
}))

const createIcon = (name: string) =>
  defineAsyncComponent(() => import(`../../atoms/PIcon/components/${name}.vue`))
</script>
