<template>
  <div class="el-menu--header shadow--3">
    <div class="menu-item menu-item--logo">
      <slot name="logo" />
    </div>
    <slot name="menu" />
    <div class="flex-grow" />
    <div class="menu-item p-header-right">
      <slot name="header-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
