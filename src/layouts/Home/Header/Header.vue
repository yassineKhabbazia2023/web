<template>
  <PHeader
    :ellipsis="false"
    :menu="props.menu"
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
      <PHeaderTabs
        :menu="props.menu"
        class="home-header-tabs"
      />
    </template>
    <template #header-right>
      <PToolbox :elements="toolboxBasicData">
        <PAvatar
          shape="circle"
          size="small"
          color="persian-gradient"
        >
        {{ initial }}
      </PAvatar>
      </PToolbox>
    </template>
  </PHeader>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, Component } from 'vue'

import { PAvatar, PHeader, PHeaderTabs, PImage, PToolbox } from '@kpmg/styleguide'
import { commonStore as store } from '@kpmg/common'

interface Item {
  icon: string
  text: string
  path: string
  component?: Component
}

interface Props {
  menu: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  menu: () => []
})

const route = useRoute()
const routeActive = route.path
const firstName = ref(store().user?.firstName)
const lastName = ref(store().user?.lastName)
const toolboxBasicData = [
  {
    iconName: 'PIPower',
    value: 'Logout',
    actionName: 'logout'
  }
]

const initial = computed(() => {
  return '' + firstName.value?.charAt(0) + lastName.value?.charAt(0)
})
</script>
<style scoped>
@media only screen and (max-width: 991px)  {
  .home-header-tabs {
    display: none;
  }
}
</style>
