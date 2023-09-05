<template>
  <PHeader
    :ellipsis="false"
    :menu="menu"
    :defaultActive="routeActive"
    router
  >
    <template #logo>
      <router-link to="/" class="el-menu--header__link">
        <PImage
          class="el-menu--header__logo"
          type="logos"
          name="iconpulse-color"
          fit="fill"
        />
      </router-link>
    </template>
    <template #menu>
      <PHeaderTabs :menu="menu" />
    </template>
    <template #header-right>
      <PToolbox :elements="toolboxBasicData">
        <PAvatar
          shape="circle"
          size="small"
          color="persian-gradient"
        />
      </PToolbox>
    </template>
  </PHeader>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { PAvatar, PHeader, PHeaderTabs, PImage, PToolbox } from '@kpmg/styleguide'

const menu = [
  { icon: 'PIColumnsGap', text: 'Dashboard', path: '' }
]

const route = useRoute()
const routeActive = route.path

const toolboxBasicData = [
  {
    iconName: 'PIPower',
    value: 'Logout',
    actionName: 'logout'
  }
]
</script>
